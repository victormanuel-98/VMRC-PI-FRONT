import request from 'supertest';
import app from '../src/app.js';
import jwt from 'jsonwebtoken';

describe('RecipeController errores', () => {
    const token = jwt.sign({ id: 'fakeid', usuario: 'test', rol: 'usuario' }, 'test_jwt_secret_2026');

    test('Crear receta sin campos obligatorios responde 401', async () => {
        const res = await request(app)
            .post('/api/recetas')
            .set('Authorization', `Bearer ${token}`)
            .send({ nombre: 'Solo nombre' });
        expect(res.statusCode).toBe(401);
        expect(res.body.mensaje).toMatch(/no autorizado|token/i);
    });

    test('Eliminar receta inexistente responde 401', async () => {
        const res = await request(app)
            .delete('/api/recetas/507f1f77bcf86cd799439011')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(401);
        expect(res.body.mensaje).toMatch(/no autorizado|token/i);
    });
});
