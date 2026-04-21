import request from 'supertest';
import app from '../src/app.js';
import jwt from 'jsonwebtoken';

describe('HistoryController errores', () => {
    const token = jwt.sign(
        { id: 'fakeid', usuario: 'test', rol: 'usuario' },
        process.env.JWT_SECRET || 'test_jwt_secret_2026'
    );

    test('Crear historial con payload inválido responde error de validación/autorización', async () => {
        const res = await request(app)
            .post('/api/historial')
            .set('Authorization', `Bearer ${token}`)
            .send({ fecha: '' });

        expect([400, 401]).toContain(res.statusCode);
        expect(res.body.mensaje).toMatch(/no autorizado|token|faltan campos|inválid/i);
    });

    test('Eliminar alimento inexistente responde error controlado', async () => {
        const res = await request(app)
            .delete('/api/historial/507f1f77bcf86cd799439011/alimento/0')
            .set('Authorization', `Bearer ${token}`);

        expect([401, 404]).toContain(res.statusCode);
        expect(res.body.mensaje).toMatch(/no autorizado|token|no encontrado/i);
    });
});
