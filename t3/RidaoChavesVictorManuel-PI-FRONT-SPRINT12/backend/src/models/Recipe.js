// Modelo Recipe: almacena recetas, autor, descripción y valores nutricionales
import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: [true, 'El nombre de la receta es requerido'],
            trim: true,
        },
        autor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        descripcionCorta: {
            type: String,
            required: [true, 'La descripción corta es requerida'],
            maxlength: [200, 'La descripción corta no puede exceder 200 caracteres'],
        },
        descripcionLarga: {
            type: String,
            default: '',
        },
        dificultad: {
            type: String,
            enum: ['facil', 'medio', 'dificil'],
            required: true,
        },
        imagen: {
            type: String,
            default: null,
        },
        ingredientes: [
            {
                ingrediente: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Ingredient',
                    required: true,
                },
                cantidad: {
                    type: Number,
                    required: true,
                    min: 0,
                },
            },
        ],
        categoria: {
            type: String,
            enum: ['desayuno', 'almuerzo', 'cena', 'snack', 'postre', 'bebida', 'merienda'],
            required: true,
        },
        tiempoPreparacion: {
            type: Number,
            default: 0,
        },
        calorias: {
            type: Number,
            default: 0,
        },
        proteinas: {
            type: Number,
            default: 0,
        },
        grasas: {
            type: Number,
            default: 0,
        },
        carbohidratos: {
            type: Number,
            default: 0,
        },
        esOficial: {
            type: Boolean,
            default: false,
        },
        puntuacionPromedio: {
            type: Number,
            default: 0,
        },
        totalValorations: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

export default mongoose.model('Recipe', recipeSchema);
