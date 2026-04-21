// Modelo History: registra el historial de alimentos consumidos por usuario y fecha
import mongoose from 'mongoose';

const historySchema = new mongoose.Schema(
    {
        usuario: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        fecha: {
            type: Date,
            required: true,
        },
        alimentos: [
            {
                receta: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Recipe',
                },
                ingrediente: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Ingredient',
                },
                cantidad: {
                    type: Number,
                    required: true,
                },
                calorias: {
                    type: Number,
                    required: true,
                },
                hora: {
                    type: String,
                    default: null,
                },
            },
        ],
        totalCalorias: {
            type: Number,
            default: 0,
        },
        totalProteinas: {
            type: Number,
            default: 0,
        },
        totalGrasas: {
            type: Number,
            default: 0,
        },
        totalCarbohidratos: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

historySchema.index({ usuario: 1, fecha: 1 }, { unique: true });

export default mongoose.model('History', historySchema);
