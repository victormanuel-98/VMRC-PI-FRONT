import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';
import User from '../src/models/User.js';
import jwt from 'jsonwebtoken';

let mongoServer;
let usuario;
let token;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    process.env.MONGODB_URI = uri;
    process.env.JWT_SECRET = 'test_secret_key';
    await mongoose.connect(uri);
    usuario = await User.create({
        usuario: 'updateuser',
        email: 'update@user.com',
        nombre: 'Update',
        apellidos: 'User',
        contrasena: 'Admin123!',
    });
    token = jwt.sign({ id: usuario._id, usuario: usuario.usuario, rol: 'usuario' }, process.env.JWT_SECRET);
});

afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
        await mongoServer.stop();
    }
});

describe('UserController - Actualizar perfil', () => {
    test('No permite actualizar perfil sin token', async () => {
        const res = await request(app)
            .put(`/api/usuarios/${usuario._id}`)
            .send({ nombre: 'NuevoNombre' });
        expect([401, 403]).toContain(res.statusCode);
    });

    test('No permite actualizar perfil de otro usuario', async () => {
        const otroToken = jwt.sign({ id: new mongoose.Types.ObjectId(), usuario: 'otro', rol: 'usuario' }, process.env.JWT_SECRET);
        const res = await request(app)
            .put(`/api/usuarios/${usuario._id}`)
            .set('Authorization', `Bearer ${otroToken}`)
            .send({ nombre: 'Hack' });
        expect(res.statusCode).toBe(403);
    });

    test('Falla si usuario no existe', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app)
            .put(`/api/usuarios/${fakeId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ nombre: 'NoExiste' });
        expect([403, 404]).toContain(res.statusCode);
    });

    test('Falla si email es inválido', async () => {
        const res = await request(app)
            .put(`/api/usuarios/${usuario._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ email: 'noemail' });
        expect(res.statusCode).toBe(400);
    });

    test('Falla si email ya está registrado', async () => {
        await User.create({ usuario: 'dup', email: 'dup@ex.com', nombre: 'Dup', contrasena: 'Admin123!' });
        const res = await request(app)
            .put(`/api/usuarios/${usuario._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ email: 'dup@ex.com' });
        expect(res.statusCode).toBe(400);
    });

    test('Falla si contraseña actual es incorrecta', async () => {
        const res = await request(app)
            .put(`/api/usuarios/${usuario._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ contrasenaActual: 'mal', contrasenaNueva: 'Admin123!' });
        expect([400, 401]).toContain(res.statusCode);
    });

    test('Falla si nueva contraseña es débil', async () => {
        const res = await request(app)
            .put(`/api/usuarios/${usuario._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ contrasenaActual: 'Admin123!', contrasenaNueva: '123' });
        expect(res.statusCode).toBe(400);
    });

    test('Actualiza nombre correctamente', async () => {
        const res = await request(app)
            .put(`/api/usuarios/${usuario._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ nombre: 'Actualizado' });
        expect(res.statusCode).toBe(200);
        expect(res.body.usuario.nombre).toBe('Actualizado');
    });
});
