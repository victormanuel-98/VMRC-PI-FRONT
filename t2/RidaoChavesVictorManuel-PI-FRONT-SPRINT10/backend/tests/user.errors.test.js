import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';
import User from '../src/models/User.js';

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    process.env.MONGODB_URI = uri;
    process.env.JWT_SECRET = 'test_secret_key';
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    if (mongoServer) {
        await mongoServer.stop();
    }
});

describe('UserController - Casos de error y validaciones', () => {
    test('Registro falla si falta campo obligatorio', async () => {
        const res = await request(app)
            .post('/api/auth/registro')
            .send({ email: 'faltan@campos.com', nombre: 'Faltan' });
        expect(res.statusCode).toBe(400);
        expect(res.body.mensaje).toMatch(/obligatorios/i);
    });

    test('Registro falla si el email es inválido', async () => {
        const res = await request(app)
            .post('/api/auth/registro')
            .send({ usuario: 'test', email: 'noemail', nombre: 'Test', contrasena: 'Admin123!' });
        expect(res.statusCode).toBe(400);
        expect(res.body.mensaje).toMatch(/email inválido/i);
    });

    test('Registro falla si la contraseña es débil', async () => {
        const res = await request(app)
            .post('/api/auth/registro')
            .send({ usuario: 'test', email: 'test@weak.com', nombre: 'Test', contrasena: '1234' });
        expect(res.statusCode).toBe(400);
        expect(res.body.mensaje).toMatch(/contraseña.*caracteres/i);
    });

    test('No se puede registrar dos veces el mismo usuario/email', async () => {
        await User.create({ usuario: 'repetido', email: 'repetido@ex.com', nombre: 'Rep', contrasena: 'Admin123!' });
        const res = await request(app)
            .post('/api/auth/registro')
            .send({ usuario: 'repetido', email: 'repetido@ex.com', nombre: 'Rep', contrasena: 'Admin123!' });
        expect(res.statusCode).toBe(400);
        expect(res.body.mensaje).toMatch(/ya registrado/i);
    });

    test('Login falla con credenciales incorrectas', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'noexiste@fail.com', contrasena: 'incorrecta' });
                expect([400, 401]).toContain(res.statusCode);
                expect([
                    "Usuario y contraseña requeridos",
                    "Credenciales inválidas",
                    "Credenciales incorrectas"
                ]).toContain(res.body.mensaje);
    });
});
