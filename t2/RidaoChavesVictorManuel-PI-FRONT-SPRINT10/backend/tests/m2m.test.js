import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';
import User from '../src/models/User.js';
import Recipe from '../src/models/Recipe.js';
// ...existing code...
import jwt from 'jsonwebtoken';

let mongoServer;
let usuario;
let receta;
let token;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    process.env.MONGODB_URI = uri;
    process.env.JWT_SECRET = 'test_secret_key';
    await mongoose.connect(uri);

    usuario = await User.create({
        usuario: 'testuser',
        email: 'testuser@example.com',
        nombre: 'Test',
        apellidos: 'User',
        contrasena: 'Admin123!',
    });

    token = jwt.sign({ id: usuario._id, usuario: usuario.usuario, rol: usuario.rol || 'usuario' }, process.env.JWT_SECRET);

    receta = await Recipe.create({
        nombre: 'Receta M2M',
        autor: usuario._id,
        descripcionCorta: 'Desc corta',
        dificultad: 'facil',
        ingredientes: [],
        categoria: 'desayuno',
        tiempoPreparacion: 10,
    });
});

afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
        await mongoServer.stop();
    }
});

describe('M2M Usuario-Receta-Favorito', () => {
    test('Un usuario puede agregar una receta a favoritos', async () => {
        const res = await request(app)
            .post('/api/favoritos')
            .set('Authorization', `Bearer ${token}`)
            .send({ recetaId: receta._id });
        expect(res.statusCode).toBe(201);
        expect(res.body.favorito.usuario).toBeDefined();
        expect(res.body.favorito.receta).toBeDefined();
    });

    test('Un usuario puede ver sus favoritos', async () => {
        const res = await request(app)
            .get('/api/favoritos')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    test('Un usuario puede eliminar una receta de favoritos', async () => {
        const res = await request(app)
            .delete(`/api/favoritos/${receta._id}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.mensaje).toBe("Receta eliminada de favoritos");
    });
});
