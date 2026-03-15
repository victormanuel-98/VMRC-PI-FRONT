import request from 'supertest';
import app from '../src/app.js';
import jwt from 'jsonwebtoken';

describe('RatingController errores', () => {
    const token = jwt.sign({ id: 'fakeid', usuario: 'test', rol: 'usuario' }, 'test_jwt_secret_2026');

    test('Valorar receta sin campos obligatorios responde 401', async () => {
        const res = await request(app)
            .post('/api/valoraciones')
            .set('Authorization', `Bearer ${token}`)
            .send({ recetaId: '' });
        expect([400, 401]).toContain(res.statusCode);
        expect(res.body.mensaje).toMatch(/no autorizado|token|faltan campos/i);
    });

    test('Eliminar valoración inexistente responde 401', async () => {
        const res = await request(app)
            .delete('/api/valoraciones/507f1f77bcf86cd799439011')
            .set('Authorization', `Bearer ${token}`);
        expect([401, 404]).toContain(res.statusCode);
        expect(res.body.mensaje).toMatch(/no autorizado|token|no encontrado/i);
    });
});
