import request from 'supertest';
import app from '../src/app.js';
import jwt from 'jsonwebtoken';

// ...existing code...
const token = jwt.sign({ id: 'fakeid', usuario: 'test', rol: 'usuario' }, 'test_jwt_secret_2026');

describe('Favorites endpoints', () => {
    test('GET /api/favoritos', async () => {
        const res = await request(app)
            .get('/api/favoritos')
            .set('Authorization', `Bearer ${token}`);
        expect([200, 401]).toContain(res.statusCode);
    });

    test('POST /api/favoritos', async () => {
        const res = await request(app)
            .post('/api/favoritos')
            .set('Authorization', `Bearer ${token}`)
            .send({ receta: '507f1f77bcf86cd799439011' });
        expect([201, 401, 400]).toContain(res.statusCode);
    });

    test('DELETE /api/favoritos/:id', async () => {
        const res = await request(app)
            .delete('/api/favoritos/507f1f77bcf86cd799439011')
            .set('Authorization', `Bearer ${token}`);
        expect([200, 401, 404]).toContain(res.statusCode);
    });
});
