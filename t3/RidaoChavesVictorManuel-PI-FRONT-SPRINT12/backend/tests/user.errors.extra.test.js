import request from 'supertest';
import app from '../src/app.js';
import jwt from 'jsonwebtoken';

describe('UserController errores extra', () => {
    const token = jwt.sign({ id: 'fakeid', usuario: 'test', rol: 'usuario' }, 'test_jwt_secret_TEST');

    test('Actualizar perfil de usuario inexistente responde 401', async () => {
        const res = await request(app)
            .put('/api/usuarios/507f1f77bcf86cd799439011')
            .set('Authorization', `Bearer ${token}`)
            .send({ nombre: 'Nuevo' });
        expect(res.statusCode).toBe(401);
        expect(res.body.mensaje).toMatch(/no autorizado|token/i);
    });

    test('Actualizar perfil con email inválido responde 401', async () => {
        const res = await request(app)
            .put('/api/usuarios/fakeid')
            .set('Authorization', `Bearer ${token}`)
            .send({ email: 'noemail' });
        expect(res.statusCode).toBe(401);
        expect(res.body.mensaje).toMatch(/no autorizado|token/i);
    });
});
