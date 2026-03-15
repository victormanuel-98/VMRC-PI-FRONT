import request from 'supertest';
import jwt from 'jsonwebtoken';
import { jest } from '@jest/globals';
import app from '../src/app.js';

const createToken = () => jwt.sign(
    { id: '123456789012345678901234', usuario: 'test', rol: 'usuario' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
);

describe('AI API', () => {
    beforeAll(() => {
        process.env.JWT_SECRET = 'test_secret_key';
        process.env.JWT_EXPIRE = '7d';
    });

    afterEach(() => {
        if (global.fetch && global.fetch.mockRestore) {
            global.fetch.mockRestore();
        }
    });

    test('POST /api/ai/chat - valida conversación vacía', async () => {
        const res = await request(app)
            .post('/api/ai/chat')
            .set('Authorization', `Bearer ${createToken()}`)
            .send({ mensajes: [] });

        expect(res.statusCode).toBe(400);
    });

    test('POST /api/ai/chat - responde correctamente', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                choices: [{ message: { content: 'Hola, ¿en qué te ayudo?' } }],
            }),
        });

        const res = await request(app)
            .post('/api/ai/chat')
            .set('Authorization', `Bearer ${createToken()}`)
            .send({ mensajes: [{ role: 'user', content: 'Hola' }] });

        expect(res.statusCode).toBe(200);
        expect(res.body.respuesta).toContain('Hola');
    });

    test('POST /api/ai/chat - maneja error de modelo', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: false,
            text: async () => 'Error LMStudio',
        });

        const res = await request(app)
            .post('/api/ai/chat')
            .set('Authorization', `Bearer ${createToken()}`)
            .send({ mensajes: [{ role: 'user', content: 'Hola' }] });

        expect(res.statusCode).toBe(502);
    });
});
