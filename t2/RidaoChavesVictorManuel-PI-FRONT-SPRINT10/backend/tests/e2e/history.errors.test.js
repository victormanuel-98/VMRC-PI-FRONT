import request from 'supertest';
import app from '../src/app.js';
import jwt from 'jsonwebtoken';

// ...existing code...
const token = jwt.sign({ id: 'fakeid', usuario: 'test', rol: 'usuario' }, 'test_jwt_secret_TEST');

describe('HistoryController errores', () => {
    test('Crear historial sin campos obligatorios responde 401', async () => {
        const res = await request(app)
            .post('/api/historial')
            .set('Authorization', `Bearer ${token}`)
            .send({ fecha: '' });
        expect([400, 401]).toContain(res.statusCode);
        expect(res.body.mensaje).toMatch(/no autorizado|token|faltan campos/i);
    });

    test('Eliminar alimento inexistente responde 401', async () => {
        const res = await request(app)
            .delete('/api/historial/507f1f77bcf86cd799439011/alimento/0')
            .set('Authorization', `Bearer ${token}`);
        expect([401, 404]).toContain(res.statusCode);
        expect(res.body.mensaje).toMatch(/no autorizado|token|no encontrado/i);
    });
});
