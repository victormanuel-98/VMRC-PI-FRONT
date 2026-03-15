import request from 'supertest';
import app from '../src/app.js';
import jwt from 'jsonwebtoken';
import { jest } from '@jest/globals';

describe('AIController errores', () => {
    const token = jwt.sign({ id: 'fakeid', usuario: 'test', rol: 'usuario' }, 'test_jwt_secret_TEST');

    test('POST /api/ai/chat - error por timeout', async () => {
        globalThis.fetch = jest.fn().mockRejectedValue({ name: 'AbortError' });
        const res = await request(app)
            .post('/api/ai/chat')
            .set('Authorization', `Bearer ${token}`)
            .send({ mensajes: [{ role: 'user', content: 'Hola' }] });
        expect(res.statusCode).toBe(401);
        expect(res.body.mensaje).toMatch(/no autorizado|token/i);
        globalThis.fetch.mockRestore();
    });

    test('POST /api/ai/chat - error genérico', async () => {
        globalThis.fetch = jest.fn().mockRejectedValue(new Error('Error genérico'));
        const res = await request(app)
            .post('/api/ai/chat')
            .set('Authorization', `Bearer ${token}`)
            .send({ mensajes: [{ role: 'user', content: 'Hola' }] });
        expect(res.statusCode).toBe(401);
        expect(res.body.mensaje).toMatch(/no autorizado|token/i);
        globalThis.fetch.mockRestore();
    });
});
