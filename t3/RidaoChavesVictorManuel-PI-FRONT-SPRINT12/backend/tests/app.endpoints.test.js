import request from 'supertest';
import app from '../src/app.js';

describe('App.js endpoints', () => {
  test('GET /api/health responde 200', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.mensaje).toMatch(/funcionando/i);
  });

  test('Ruta inexistente responde 404', async () => {
    const res = await request(app).get('/ruta-que-no-existe');
    expect(res.statusCode).toBe(404);
    expect(res.body.mensaje).toMatch(/no encontrada/i);
  });
});
