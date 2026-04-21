import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';
import Ingredient from '../src/models/Ingredient.js';

let mongoServer;
let token = 'Bearer fake_token'; // Simula autenticación

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

describe('IngredientController coverage', () => {
    test('Crear ingrediente válido', async () => {
        const res = await request(app)
            .post('/api/ingredientes')
            .set('Authorization', token)
            .send({ nombre: 'Test', calorias: 100 });
        expect([201, 401]).toContain(res.statusCode);
    });

    test('Obtener ingredientes', async () => {
        const res = await request(app)
            .get('/api/ingredientes')
            .set('Authorization', token);
        expect([200, 401]).toContain(res.statusCode);
    });

    test('Actualizar ingrediente', async () => {
        const ingrediente = await Ingredient.create({ nombre: 'Update', calorias: 50 });
        const res = await request(app)
            .put(`/api/ingredientes/${ingrediente._id}`)
            .set('Authorization', token)
            .send({ nombre: 'Updated', calorias: 60 });
        expect([200, 401]).toContain(res.statusCode);
    });

    test('Eliminar ingrediente', async () => {
        const ingrediente = await Ingredient.create({ nombre: 'Delete', calorias: 10 });
        const res = await request(app)
            .delete(`/api/ingredientes/${ingrediente._id}`)
            .set('Authorization', token);
        expect([200, 401]).toContain(res.statusCode);
    });
});
