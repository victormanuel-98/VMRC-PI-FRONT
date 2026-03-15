import request from 'supertest';
import app from '../src/app.js';
import jwt from 'jsonwebtoken';

describe('ContactController errores', () => {
    const token = jwt.sign({ id: 'fakeid', usuario: 'test', rol: 'usuario' }, 'test_jwt_secret_2026');

    test('Enviar contacto sin campos obligatorios responde 401', async () => {
        const res = await request(app)
            .post('/api/contacto')
            .set('Authorization', `Bearer ${token}`)
            .send({ mensaje: '' });
        expect([400, 401]).toContain(res.statusCode);
        expect(res.body.mensaje).toMatch(/no autorizado|token|faltan campos|todos los campos/i);
    });
});
