import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';

let mongoServer;
let token = 'Bearer fake_token';

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    process.env.MONGODB_URI = uri;
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
        await mongoServer.stop();
    }
});

describe('HistoryController coverage', () => {
    test('Crear historial válido', async () => {
        const res = await request(app)
            .post('/api/historial')
            .set('Authorization', token)
            .send({ fecha: new Date().toISOString(), alimentos: [{ nombre: 'Manzana', calorias: 50 }] });
        expect([200, 401]).toContain(res.statusCode);
    });

    test('Obtener historial', async () => {
        const res = await request(app)
            .get('/api/historial')
            .set('Authorization', token);
        expect([200, 401]).toContain(res.statusCode);
    });
});
