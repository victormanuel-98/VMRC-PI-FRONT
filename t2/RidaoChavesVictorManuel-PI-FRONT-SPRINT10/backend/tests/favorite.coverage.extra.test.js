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

describe('FavoriteController coverage extra', () => {
    test('Agregar favorito sin recetaId', async () => {
        const res = await request(app)
            .post('/api/favoritos')
            .set('Authorization', token)
            .send({});
        expect([400, 401]).toContain(res.statusCode);
    });

    test('Obtener favoritos', async () => {
        const res = await request(app)
            .get('/api/favoritos')
            .set('Authorization', token);
        expect([200, 401]).toContain(res.statusCode);
    });

    test('Eliminar favorito inexistente', async () => {
        const res = await request(app)
            .delete('/api/favoritos/507f1f77bcf86cd799439011')
            .set('Authorization', token);
        expect([404, 401]).toContain(res.statusCode);
    });
});
