import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import express from 'express';
import jwt from 'jsonwebtoken';
import app from '../src/app.js';
import { autenticar, autorizarRol } from '../src/middlewares/authMiddleware.js';

let mongoServer;

beforeAll(async () => {
    process.env.JWT_SECRET = 'test_secret_key';
    process.env.JWT_EXPIRE = '7d';

    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    process.env.MONGODB_URI = uri;

    await mongoose.connect(uri);
// ...existing code...
    afterAll(async () => {
        await mongoose.disconnect();
        if (mongoServer) {
            await mongoServer.stop();
        }
    });

        const res = await request(app)
    await mongoose.disconnect();
    if (mongoServer) {
        await mongoServer.stop();
    }
});
            .post('/api/auth/login')
            .send({
                usuario: 'victor_98',
                contrasena: 'Admin123!',
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBeDefined();
    });

    test('POST /api/auth/login - login incorrecto', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                usuario: 'victor_98',
                contrasena: 'WrongPass123!',
            });

        expect(res.statusCode).toBe(401);
    });

    test('POST /api/auth/registro - email inválido', async () => {
        const res = await request(app)
            .post('/api/auth/registro')
            .send({
                usuario: 'malo_email',
                email: 'no-es-email',
                nombre: 'Test',
                apellidos: 'User',
                contrasena: 'Admin123!',
            });

        expect(res.statusCode).toBe(400);
    });

    test('POST /api/auth/registro - contraseña débil', async () => {
        const res = await request(app)
            .post('/api/auth/registro')
            .send({
                usuario: 'pass_debil',
                email: 'passdebil@example.com',
                nombre: 'Test',
                apellidos: 'User',
                contrasena: 'abc',
            });

        expect(res.statusCode).toBe(400);
    });

    test('POST /api/auth/registro - usuario duplicado', async () => {
        const res = await request(app)
            .post('/api/auth/registro')
            .send({
                usuario: 'victor_98',
                email: 'victor2@example.com',
                nombre: 'Víctor',
                apellidos: 'Duplicado',
                contrasena: 'Admin123!',
            });

        expect(res.statusCode).toBe(400);
    });

    test('GET /api/auth/verificar - token válido', async () => {
        const login = await request(app)
            .post('/api/auth/login')
            .send({
                usuario: 'victor_98',
                contrasena: 'Admin123!',
            });

        const token = login.body.token;

        const res = await request(app)
            .get('/api/auth/verificar')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.valido).toBe(true);
    });

    test('GET /api/auth/verificar - sin token', async () => {
        const res = await request(app).get('/api/auth/verificar');
        expect(res.statusCode).toBe(401);
    });

    test('GET /api/auth/verificar - token inválido', async () => {
        const res = await request(app)
            .get('/api/auth/verificar')
            .set('Authorization', 'Bearer token_invalido');
        expect(res.statusCode).toBe(401);
    });
});

describe('Health check', () => {
    test('GET /api/health - responde OK', async () => {
        const res = await request(app).get('/api/health');
        expect(res.statusCode).toBe(200);
        expect(res.body.mensaje).toContain('Backend de FitFood');
    });
});

describe('Middleware de roles', () => {
    const roleApp = express();
    roleApp.get('/admin', autenticar, autorizarRol('admin'), (req, res) => {
        res.status(200).json({ ok: true });
    });

    test('GET /admin - usuario sin rol permitido', async () => {
        const token = jwt.sign(
            { id: '123', usuario: 'user', rol: 'usuario' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const res = await request(roleApp)
            .get('/admin')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(403);
    });

    test('GET /admin - admin permitido', async () => {
        const token = jwt.sign(
            { id: '123', usuario: 'admin', rol: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const res = await request(roleApp)
            .get('/admin')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.ok).toBe(true);
    });
});

describe('Rutas no encontradas', () => {
    test('GET /no-existe - 404', async () => {
        const res = await request(app).get('/no-existe');
        expect(res.statusCode).toBe(404);
    });
});
