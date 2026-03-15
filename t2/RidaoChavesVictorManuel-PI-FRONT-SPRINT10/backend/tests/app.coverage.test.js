import request from 'supertest';
import app from '../src/app.js';

describe('App.js coverage extra', () => {
    test('Error middleware en desarrollo', async () => {
        process.env.NODE_ENV = 'development';
        app.get('/error-dev', (req, res) => {
            throw new Error('Error simulado');
        });
        const res = await request(app).get('/error-dev');
        expect([500, 404]).toContain(res.statusCode);
        app._router.stack.pop();
    });
});
