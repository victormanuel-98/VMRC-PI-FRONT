import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import app from '../src/app.js';
import User from '../src/models/User.js';
import Ingredient from '../src/models/Ingredient.js';
import Recipe from '../src/models/Recipe.js';

let mongoServer;
let token;
let recetaId;

beforeAll(async () => {
    process.env.JWT_SECRET = 'test_secret_key';
    process.env.JWT_EXPIRE = '7d';

    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    process.env.MONGODB_URI = uri;

    await mongoose.connect(uri);

    const usuario = new User({
        usuario: 'user_test',
        email: 'user_test@example.com',
        nombre: 'User',
        apellidos: 'Test',
        contrasena: 'Admin123!',
        rol: 'usuario',
    });
    await usuario.save();

    const ingrediente = await Ingredient.create({
        nombre: 'Ingrediente Test',
        calorias: 100,
        unidad: 'g',
        proteinas: 10,
        grasas: 2,
        carbohidratos: 15,
        descripcion: '',
    });

    const receta = await Recipe.create({
        nombre: 'Receta Test',
        autor: usuario._id,
        descripcionCorta: 'Descripcion corta',
        descripcionLarga: 'Descripcion larga',
        dificultad: 'facil',
        ingredientes: [{ ingrediente: ingrediente._id, cantidad: 100 }],
        categoria: 'desayuno',
        tiempoPreparacion: 10,
        calorias: 100,
        proteinas: 10,
        grasas: 2,
        carbohidratos: 15,
        esOficial: false,
        imagen: null,
    });

    recetaId = receta._id.toString();
    token = jwt.sign(
        { id: usuario._id.toString(), usuario: usuario.usuario, rol: usuario.rol },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
});



    test('POST /api/favoritos - agrega favorito con datos poblados', async () => {
        const res = await request(app)
            .post('/api/favoritos')
            .set('Authorization', `Bearer ${token}`)
            .send({ recetaId });

        expect(res.statusCode).toBe(201);
        expect(res.body.favorito.usuario).toBeDefined();
        expect(res.body.favorito.receta).toBeDefined();
        expect(res.body.favorito.receta.nombre).toBe('Receta Test');
    });

    test('GET /api/favoritos - lista favoritos del usuario', async () => {
        const res = await request(app)
            .get('/api/favoritos')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(1);
        expect(res.body[0].receta.nombre).toBe('Receta Test');
    });

    test('POST /api/favoritos - evita duplicados', async () => {
        const res = await request(app)
            .post('/api/favoritos')
            .set('Authorization', `Bearer ${token}`)
            .send({ recetaId });

        expect(res.statusCode).toBe(400);
    });

    test('DELETE /api/favoritos/:recetaId - elimina favorito', async () => {
        const res = await request(app)
            .delete(`/api/favoritos/${recetaId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
    });

    test('DELETE /api/favoritos/:recetaId - no encontrado', async () => {
        const res = await request(app)
            .delete(`/api/favoritos/${recetaId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(404);
    });
afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
        await mongoServer.stop();
    }
});
