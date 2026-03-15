// Script de seed: carga recetas iniciales en la base de datos
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Ingredient from '../models/Ingredient.js';
import Recipe from '../models/Recipe.js';
import User from '../models/User.js';

dotenv.config();

const obtenerIngredientePorNombre = async (nombre) => {
    const ingrediente = await Ingredient.findOne({ nombre });
    if (!ingrediente) {
        throw new Error(`Ingrediente no encontrado: ${nombre}`);
    }
    return ingrediente;
};

const calcularTotales = async (ingredientes) => {
    let totalCalorias = 0;
    let totalProteinas = 0;
    let totalGrasas = 0;
    let totalCarbohidratos = 0;

    for (const item of ingredientes) {
        const ingrediente = await Ingredient.findById(item.ingrediente);
        const cantidad = item.cantidad;

        totalCalorias += (ingrediente.calorias * cantidad) / 100;
        totalProteinas += (ingrediente.proteinas * cantidad) / 100;
        totalGrasas += (ingrediente.grasas * cantidad) / 100;
        totalCarbohidratos += (ingrediente.carbohidratos * cantidad) / 100;
    }

    return {
        calorias: Math.round(totalCalorias),
        proteinas: Math.round(totalProteinas),
        grasas: Math.round(totalGrasas),
        carbohidratos: Math.round(totalCarbohidratos),
    };
};

const seedRecetas = async () => {
    try {
        await connectDB();

        const emailNutri = 'nutricionista@fitfood.com';
        let nutricionista = await User.findOne({ email: emailNutri });

        if (!nutricionista) {
            nutricionista = new User({
                usuario: 'nutri_fitfood',
                email: emailNutri,
                nombre: 'Nutricionista',
                apellidos: 'FitFood',
                contrasena: 'Admin123!',
                rol: 'nutricionista',
            });
            await nutricionista.save();
        }

        await Recipe.deleteMany();

        const recetasBase = [
            {
                nombre: 'Hamburguesa vegana saludable',
                descripcionCorta: 'Hamburguesa vegetal con pan integral y verduras frescas.',
                descripcionLarga: 'Una opción saludable y saciante con proteína vegetal, verduras y pan integral.',
                dificultad: 'facil',
                categoria: 'almuerzo',
                tiempoPreparacion: 20,
                ingredientes: [
                    { nombre: 'Pan integral para hamburguesa', cantidad: 90 },
                    { nombre: 'Hamburguesa vegana (soja)', cantidad: 120 },
                    { nombre: 'Lechuga', cantidad: 40 },
                    { nombre: 'Tomate', cantidad: 60 },
                    { nombre: 'Cebolla', cantidad: 30 },
                ],
                imagen: null,
            },
            {
                nombre: 'Batido proteico de plátano y cacao',
                descripcionCorta: 'Batido cremoso con proteína vegetal y cacao puro.',
                descripcionLarga: 'Ideal para post-entreno o desayuno, con alto contenido en proteína.',
                dificultad: 'facil',
                categoria: 'desayuno',
                tiempoPreparacion: 5,
                ingredientes: [
                    { nombre: 'Leche de almendras sin azúcar', cantidad: 250 },
                    { nombre: 'Proteína vegetal', cantidad: 30 },
                    { nombre: 'Plátano', cantidad: 120 },
                    { nombre: 'Cacao puro', cantidad: 8 },
                    { nombre: 'Mantequilla de cacahuete 100%', cantidad: 10 },
                ],
                imagen: null,
            },
            {
                nombre: 'Avena con chía y frutos rojos',
                descripcionCorta: 'Desayuno rápido y nutritivo con avena, chía y fruta.',
                descripcionLarga: 'Alto en fibra y grasas saludables, perfecto para empezar el día.',
                dificultad: 'facil',
                categoria: 'desayuno',
                tiempoPreparacion: 10,
                ingredientes: [
                    { nombre: 'Copos de avena', cantidad: 50 },
                    { nombre: 'Chía', cantidad: 10 },
                    { nombre: 'Leche de almendras sin azúcar', cantidad: 200 },
                    { nombre: 'Fresas', cantidad: 80 },
                    { nombre: 'Arándanos', cantidad: 50 },
                ],
                imagen: null,
            },
            {
                nombre: 'Bowl de quinoa con tofu y verduras',
                descripcionCorta: 'Quinoa con tofu, brócoli y verduras salteadas.',
                descripcionLarga: 'Plato completo con proteína vegetal, fibra y micronutrientes.',
                dificultad: 'medio',
                categoria: 'almuerzo',
                tiempoPreparacion: 25,
                ingredientes: [
                    { nombre: 'Quinoa cocida', cantidad: 180 },
                    { nombre: 'Tofu firme', cantidad: 120 },
                    { nombre: 'Brócoli', cantidad: 100 },
                    { nombre: 'Zanahoria', cantidad: 60 },
                    { nombre: 'Pimiento rojo', cantidad: 50 },
                    { nombre: 'Aceite de oliva virgen extra', cantidad: 10 },
                    { nombre: 'Salsa de soja baja en sal', cantidad: 10 },
                ],
                imagen: null,
            },
            {
                nombre: 'Ensalada mediterránea con garbanzos',
                descripcionCorta: 'Ensalada fresca con garbanzos y verduras.',
                descripcionLarga: 'Una opción ligera y nutritiva con grasas saludables y proteínas vegetales.',
                dificultad: 'facil',
                categoria: 'cena',
                tiempoPreparacion: 15,
                ingredientes: [
                    { nombre: 'Garbanzos cocidos', cantidad: 150 },
                    { nombre: 'Tomate cherry', cantidad: 80 },
                    { nombre: 'Pepino', cantidad: 80 },
                    { nombre: 'Cebolla', cantidad: 30 },
                    { nombre: 'Lechuga', cantidad: 60 },
                    { nombre: 'Aceite de oliva virgen extra', cantidad: 10 },
                    { nombre: 'Limón', cantidad: 10 },
                ],
                imagen: null,
            },
            {
                nombre: 'Tostada integral con aguacate y huevo',
                descripcionCorta: 'Tostada crujiente con aguacate y huevo.',
                descripcionLarga: 'Desayuno completo con grasas saludables y proteína.',
                dificultad: 'facil',
                categoria: 'desayuno',
                tiempoPreparacion: 10,
                ingredientes: [
                    { nombre: 'Pan integral', cantidad: 60 },
                    { nombre: 'Aguacate', cantidad: 80 },
                    { nombre: 'Huevos', cantidad: 60 },
                    { nombre: 'Tomate', cantidad: 40 },
                ],
                imagen: null,
            },
            {
                nombre: 'Wrap integral de pavo y verduras',
                descripcionCorta: 'Wrap integral con pavo, lechuga y tomate.',
                descripcionLarga: 'Perfecto para una comida rápida, saludable y rica en proteína.',
                dificultad: 'facil',
                categoria: 'almuerzo',
                tiempoPreparacion: 12,
                ingredientes: [
                    { nombre: 'Tortilla de trigo integral', cantidad: 70 },
                    { nombre: 'Pavo', cantidad: 90 },
                    { nombre: 'Lechuga', cantidad: 40 },
                    { nombre: 'Tomate', cantidad: 50 },
                    { nombre: 'Mostaza Dijon', cantidad: 5 },
                ],
                imagen: null,
            },
        ];

        const recetas = [];

        for (const recetaBase of recetasBase) {
            const ingredientes = [];

            for (const item of recetaBase.ingredientes) {
                const ingrediente = await obtenerIngredientePorNombre(item.nombre);
                ingredientes.push({
                    ingrediente: ingrediente._id,
                    cantidad: item.cantidad,
                });
            }

            const totales = await calcularTotales(ingredientes);

            recetas.push({
                nombre: recetaBase.nombre,
                autor: nutricionista._id,
                descripcionCorta: recetaBase.descripcionCorta,
                descripcionLarga: recetaBase.descripcionLarga,
                dificultad: recetaBase.dificultad,
                ingredientes,
                categoria: recetaBase.categoria,
                tiempoPreparacion: recetaBase.tiempoPreparacion,
                calorias: totales.calorias,
                proteinas: totales.proteinas,
                grasas: totales.grasas,
                carbohidratos: totales.carbohidratos,
                esOficial: true,
                imagen: recetaBase.imagen,
            });
        }

        await Recipe.insertMany(recetas);

        console.log('Recetas insertadas correctamente');
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Error al insertar recetas:', error);
        process.exit(1);
    }
};

seedRecetas();
