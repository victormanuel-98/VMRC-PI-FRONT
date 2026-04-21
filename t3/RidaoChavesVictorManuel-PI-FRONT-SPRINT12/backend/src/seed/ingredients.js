// Script de seed: carga ingredientes iniciales en la base de datos
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Ingredient from '../models/Ingredient.js';

dotenv.config();

const ingredientes = [
    { nombre: 'Pechuga de pollo', calorias: 165, unidad: 'g', proteinas: 31, grasas: 3.6, carbohidratos: 0 },
    { nombre: 'Pavo', calorias: 135, unidad: 'g', proteinas: 29, grasas: 1.6, carbohidratos: 0 },
    { nombre: 'Atún en agua', calorias: 116, unidad: 'g', proteinas: 26, grasas: 1, carbohidratos: 0 },
    { nombre: 'Salmón', calorias: 208, unidad: 'g', proteinas: 20, grasas: 13, carbohidratos: 0 },
    { nombre: 'Huevos', calorias: 143, unidad: 'g', proteinas: 13, grasas: 10, carbohidratos: 1.1 },
    { nombre: 'Claras de huevo', calorias: 52, unidad: 'g', proteinas: 11, grasas: 0.2, carbohidratos: 0.7 },
    { nombre: 'Tofu firme', calorias: 76, unidad: 'g', proteinas: 8, grasas: 4.8, carbohidratos: 1.9 },
    { nombre: 'Tempeh', calorias: 193, unidad: 'g', proteinas: 20, grasas: 11, carbohidratos: 9 },
    { nombre: 'Seitán', calorias: 143, unidad: 'g', proteinas: 25, grasas: 2, carbohidratos: 5 },
    { nombre: 'Lentejas cocidas', calorias: 116, unidad: 'g', proteinas: 9, grasas: 0.4, carbohidratos: 20 },
    { nombre: 'Garbanzos cocidos', calorias: 164, unidad: 'g', proteinas: 9, grasas: 2.6, carbohidratos: 27 },
    { nombre: 'Alubias negras cocidas', calorias: 132, unidad: 'g', proteinas: 8.9, grasas: 0.5, carbohidratos: 23.7 },
    { nombre: 'Edamame', calorias: 122, unidad: 'g', proteinas: 11.9, grasas: 5.2, carbohidratos: 8.9 },
    { nombre: 'Yogur griego 0%', calorias: 59, unidad: 'g', proteinas: 10, grasas: 0.4, carbohidratos: 3.6 },
    { nombre: 'Queso cottage', calorias: 98, unidad: 'g', proteinas: 11, grasas: 4.3, carbohidratos: 3.4 },
    { nombre: 'Proteína de suero (whey)', calorias: 400, unidad: 'g', proteinas: 80, grasas: 7, carbohidratos: 7 },
    { nombre: 'Leche desnatada', calorias: 35, unidad: 'ml', proteinas: 3.5, grasas: 0.1, carbohidratos: 5 },
    { nombre: 'Bebida de soja sin azúcar', calorias: 33, unidad: 'ml', proteinas: 3.3, grasas: 1.8, carbohidratos: 0.7 },

    { nombre: 'Avena', calorias: 389, unidad: 'g', proteinas: 16.9, grasas: 6.9, carbohidratos: 66.3 },
    { nombre: 'Quinoa cocida', calorias: 120, unidad: 'g', proteinas: 4.4, grasas: 1.9, carbohidratos: 21.3 },
    { nombre: 'Arroz integral cocido', calorias: 111, unidad: 'g', proteinas: 2.6, grasas: 0.9, carbohidratos: 23 },
    { nombre: 'Cuscús integral cocido', calorias: 112, unidad: 'g', proteinas: 3.8, grasas: 0.2, carbohidratos: 23.2 },
    { nombre: 'Pasta integral cocida', calorias: 124, unidad: 'g', proteinas: 5, grasas: 0.9, carbohidratos: 26 },
    { nombre: 'Pan de centeno integral', calorias: 259, unidad: 'g', proteinas: 9, grasas: 3.3, carbohidratos: 48 },
    { nombre: 'Pan integral', calorias: 247, unidad: 'g', proteinas: 13, grasas: 4.2, carbohidratos: 41 },
    { nombre: 'Tortilla de trigo integral', calorias: 275, unidad: 'g', proteinas: 8, grasas: 7, carbohidratos: 45 },
    { nombre: 'Pan pita integral', calorias: 260, unidad: 'g', proteinas: 9, grasas: 2, carbohidratos: 53 },
    { nombre: 'Tortitas de arroz', calorias: 387, unidad: 'g', proteinas: 7.5, grasas: 3.3, carbohidratos: 81 },
    { nombre: 'Batata cocida', calorias: 86, unidad: 'g', proteinas: 1.6, grasas: 0.1, carbohidratos: 20.1 },
    { nombre: 'Patata cocida', calorias: 87, unidad: 'g', proteinas: 1.9, grasas: 0.1, carbohidratos: 20 },

    { nombre: 'Plátano', calorias: 89, unidad: 'g', proteinas: 1.1, grasas: 0.3, carbohidratos: 23 },
    { nombre: 'Manzana', calorias: 52, unidad: 'g', proteinas: 0.3, grasas: 0.2, carbohidratos: 14 },
    { nombre: 'Fresas', calorias: 32, unidad: 'g', proteinas: 0.7, grasas: 0.3, carbohidratos: 7.7 },
    { nombre: 'Frambuesas', calorias: 52, unidad: 'g', proteinas: 1.2, grasas: 0.7, carbohidratos: 12 },
    { nombre: 'Arándanos', calorias: 57, unidad: 'g', proteinas: 0.7, grasas: 0.3, carbohidratos: 14.5 },
    { nombre: 'Kiwi', calorias: 61, unidad: 'g', proteinas: 1.1, grasas: 0.5, carbohidratos: 14.7 },
    { nombre: 'Naranja', calorias: 47, unidad: 'g', proteinas: 0.9, grasas: 0.1, carbohidratos: 12 },
    { nombre: 'Mango', calorias: 60, unidad: 'g', proteinas: 0.8, grasas: 0.4, carbohidratos: 15 },
    { nombre: 'Piña', calorias: 50, unidad: 'g', proteinas: 0.5, grasas: 0.1, carbohidratos: 13 },
    { nombre: 'Uvas', calorias: 69, unidad: 'g', proteinas: 0.7, grasas: 0.2, carbohidratos: 18 },

    { nombre: 'Espinacas', calorias: 23, unidad: 'g', proteinas: 2.9, grasas: 0.4, carbohidratos: 3.6 },
    { nombre: 'Kale', calorias: 49, unidad: 'g', proteinas: 4.3, grasas: 0.9, carbohidratos: 8.8 },
    { nombre: 'Brócoli', calorias: 34, unidad: 'g', proteinas: 2.8, grasas: 0.4, carbohidratos: 6.6 },
    { nombre: 'Coliflor', calorias: 25, unidad: 'g', proteinas: 1.9, grasas: 0.3, carbohidratos: 5 },
    { nombre: 'Calabacín', calorias: 17, unidad: 'g', proteinas: 1.2, grasas: 0.3, carbohidratos: 3.1 },
    { nombre: 'Berenjena', calorias: 25, unidad: 'g', proteinas: 1, grasas: 0.2, carbohidratos: 6 },
    { nombre: 'Zanahoria', calorias: 41, unidad: 'g', proteinas: 0.9, grasas: 0.2, carbohidratos: 9.6 },
    { nombre: 'Judías verdes', calorias: 31, unidad: 'g', proteinas: 1.8, grasas: 0.1, carbohidratos: 7 },
    { nombre: 'Pimiento rojo', calorias: 31, unidad: 'g', proteinas: 1, grasas: 0.3, carbohidratos: 6 },
    { nombre: 'Tomate', calorias: 18, unidad: 'g', proteinas: 0.9, grasas: 0.2, carbohidratos: 3.9 },
    { nombre: 'Tomate cherry', calorias: 18, unidad: 'g', proteinas: 0.9, grasas: 0.2, carbohidratos: 3.9 },
    { nombre: 'Cebolla', calorias: 40, unidad: 'g', proteinas: 1.1, grasas: 0.1, carbohidratos: 9.3 },
    { nombre: 'Aguacate', calorias: 160, unidad: 'g', proteinas: 2, grasas: 14.7, carbohidratos: 8.5 },
    { nombre: 'Pepino', calorias: 15, unidad: 'g', proteinas: 0.7, grasas: 0.1, carbohidratos: 3.6 },
    { nombre: 'Lechuga', calorias: 15, unidad: 'g', proteinas: 1.4, grasas: 0.2, carbohidratos: 2.9 },
    { nombre: 'Champiñones', calorias: 22, unidad: 'g', proteinas: 3.1, grasas: 0.3, carbohidratos: 3.3 },
    { nombre: 'Guisantes', calorias: 81, unidad: 'g', proteinas: 5.4, grasas: 0.4, carbohidratos: 14 },
    { nombre: 'Maíz dulce', calorias: 86, unidad: 'g', proteinas: 3.4, grasas: 1.2, carbohidratos: 19 },

    { nombre: 'Aceite de oliva virgen extra', calorias: 884, unidad: 'g', proteinas: 0, grasas: 100, carbohidratos: 0 },
    { nombre: 'Semillas de chía', calorias: 486, unidad: 'g', proteinas: 17, grasas: 31, carbohidratos: 42 },
    { nombre: 'Semillas de lino', calorias: 534, unidad: 'g', proteinas: 18.3, grasas: 42.2, carbohidratos: 28.9 },
    { nombre: 'Almendras', calorias: 579, unidad: 'g', proteinas: 21.2, grasas: 49.9, carbohidratos: 21.6 },
    { nombre: 'Nueces', calorias: 654, unidad: 'g', proteinas: 15.2, grasas: 65.2, carbohidratos: 13.7 },
    { nombre: 'Mantequilla de cacahuete 100%', calorias: 588, unidad: 'g', proteinas: 25, grasas: 50, carbohidratos: 20 },
    { nombre: 'Tahini', calorias: 595, unidad: 'g', proteinas: 17, grasas: 53, carbohidratos: 21 },
    { nombre: 'Aceite de coco', calorias: 892, unidad: 'g', proteinas: 0, grasas: 100, carbohidratos: 0 },

    { nombre: 'Cacao puro', calorias: 228, unidad: 'g', proteinas: 20, grasas: 14, carbohidratos: 50 },
    { nombre: 'Canela', calorias: 247, unidad: 'g', proteinas: 4, grasas: 1.2, carbohidratos: 81 },
    { nombre: 'Miel', calorias: 304, unidad: 'g', proteinas: 0.3, grasas: 0, carbohidratos: 82 },
    { nombre: 'Stevia', calorias: 0, unidad: 'g', proteinas: 0, grasas: 0, carbohidratos: 0 },
    { nombre: 'Sal marina', calorias: 0, unidad: 'g', proteinas: 0, grasas: 0, carbohidratos: 0 },
    { nombre: 'Pimienta negra', calorias: 251, unidad: 'g', proteinas: 10.4, grasas: 3.3, carbohidratos: 64 },
    { nombre: 'Limón', calorias: 29, unidad: 'g', proteinas: 1.1, grasas: 0.3, carbohidratos: 9.3 },
    { nombre: 'Vinagre balsámico', calorias: 88, unidad: 'g', proteinas: 0.5, grasas: 0, carbohidratos: 17 },
    { nombre: 'Salsa de soja baja en sal', calorias: 53, unidad: 'g', proteinas: 8, grasas: 0.6, carbohidratos: 4.9 },
    { nombre: 'Mostaza Dijon', calorias: 66, unidad: 'g', proteinas: 4.4, grasas: 3.7, carbohidratos: 5.7 },

    { nombre: 'Pan integral para hamburguesa', calorias: 250, unidad: 'g', proteinas: 9, grasas: 4, carbohidratos: 45 },
    { nombre: 'Hamburguesa vegana (soja)', calorias: 180, unidad: 'g', proteinas: 18, grasas: 7, carbohidratos: 11 },
    { nombre: 'Leche de almendras sin azúcar', calorias: 13, unidad: 'ml', proteinas: 0.4, grasas: 1.1, carbohidratos: 0.3 },
    { nombre: 'Proteína vegetal', calorias: 380, unidad: 'g', proteinas: 75, grasas: 6, carbohidratos: 8 },
    { nombre: 'Chía', calorias: 486, unidad: 'g', proteinas: 17, grasas: 31, carbohidratos: 42 },
    { nombre: 'Copos de avena', calorias: 389, unidad: 'g', proteinas: 16.9, grasas: 6.9, carbohidratos: 66.3 },
    { nombre: 'Hummus', calorias: 166, unidad: 'g', proteinas: 7.9, grasas: 9.6, carbohidratos: 14.3 },
    { nombre: 'Soja texturizada', calorias: 336, unidad: 'g', proteinas: 50, grasas: 1.2, carbohidratos: 30 },
    { nombre: 'Yogur natural 0%', calorias: 41, unidad: 'g', proteinas: 4, grasas: 0.2, carbohidratos: 5 },
    { nombre: 'Skyr natural', calorias: 59, unidad: 'g', proteinas: 11, grasas: 0.2, carbohidratos: 3.6 },
];

const seedIngredientes = async () => {
    try {
        await connectDB();
        await Ingredient.deleteMany();
        await Ingredient.insertMany(ingredientes);
        console.log('Ingredientes insertados correctamente');
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Error al insertar ingredientes:', error);
        process.exit(1);
    }
};

seedIngredientes();
