import request from 'supertest';
import app from '../src/app.js';
import jwt from 'jsonwebtoken';

describe('IngredientController errores', () => {
    const token = jwt.sign({ id: 'fakeid', usuario: 'test', rol: 'usuario' }, 'test_jwt_secret_2026');

    test('Crear ingrediente sin campos obligatorios responde 401', async () => {
        const res = await request(app)
            .post('/api/ingredientes')
            .set('Authorization', `Bearer ${token}`)
            .send({ nombre: '' });
        expect([400, 401]).toContain(res.statusCode);
        expect(res.body.mensaje).toMatch(/no autorizado|token|faltan campos/i);
    });

    test('Eliminar ingrediente inexistente responde 401', async () => {
        const res = await request(app)
            .delete('/api/ingredientes/507f1f77bcf86cd799439011')
            .set('Authorization', `Bearer ${token}`);
        expect([401, 404]).toContain(res.statusCode);
        expect(res.body.mensaje).toMatch(/no autorizado|token|no encontrado/i);
    });
});
