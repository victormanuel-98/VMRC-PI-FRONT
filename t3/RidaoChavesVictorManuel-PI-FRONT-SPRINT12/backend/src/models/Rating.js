// Modelo Rating: almacena valoraciones de usuarios sobre recetas
import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema(
    {
        usuario: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        receta: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Recipe',
            required: true,
        },
        puntuacion: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comentario: {
            type: String,
            maxlength: [500, 'El comentario no puede exceder 500 caracteres'],
        },
    },
    { timestamps: true }
);

ratingSchema.index({ usuario: 1, receta: 1 }, { unique: true });

export default mongoose.model('Rating', ratingSchema);
