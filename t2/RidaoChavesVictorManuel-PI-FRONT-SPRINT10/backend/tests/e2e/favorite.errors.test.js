import request from 'supertest';
import app from '../src/app.js';
import jwt from 'jsonwebtoken';

// ...existing code...
const token = jwt.sign({ id: 'fakeid', usuario: 'test', rol: 'usuario' }, 'test_jwt_secret_2026');

describe('FavoriteController errores', () => {
    test('Error al agregar favorito', async () => {
        const res = await request(app)
            .post('/api/favoritos')
            .set('Authorization', `Bearer ${token}`)
            .send({ receta: 'invalidid' });
        expect([400, 401, 500]).toContain(res.statusCode);
        expect(res.body.mensaje).toMatch(/error al agregar favorito|no autorizado|token/i);
    });

    test('Error al obtener favoritos', async () => {
        const res = await request(app)
            .get('/api/favoritos')
            .set('Authorization', `Bearer ${token}`);
        expect([400, 401, 500]).toContain(res.statusCode);
        expect(res.body.mensaje).toMatch(/error al obtener favoritos|no autorizado|token/i);
    });

    test('Error al eliminar favorito', async () => {
        const res = await request(app)
            .delete('/api/favoritos/invalidid')
            .set('Authorization', `Bearer ${token}`);
        expect([400, 401, 500]).toContain(res.statusCode);
        expect(res.body.mensaje).toMatch(/error al eliminar favorito|no autorizado|token/i);
    });
});
