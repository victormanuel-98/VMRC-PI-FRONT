// Modelo Ingredient: almacena información nutricional de ingredientes
import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: [true, 'El nombre del ingrediente es requerido'],
            unique: true,
            trim: true,
        },
        calorias: {
            type: Number,
            required: [true, 'Las calorías son requeridas'],
            min: 0,
        },
        unidad: {
            type: String,
            enum: ['g', 'ml', 'unidad'],
            default: 'g',
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
        descripcion: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

export default mongoose.model('Ingredient', ingredientSchema);
