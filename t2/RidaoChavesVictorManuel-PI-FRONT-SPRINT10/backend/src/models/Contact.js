// Modelo Contact: almacena mensajes enviados por usuarios desde el formulario de contacto
import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: [true, 'El nombre es requerido'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'El email es requerido'],
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor introduce un email válido'],
        },
        asunto: {
            type: String,
            required: [true, 'El asunto es requerido'],
            trim: true,
        },
        mensaje: {
            type: String,
            required: [true, 'El mensaje es requerido'],
            minlength: [10, 'El mensaje debe tener al menos 10 caracteres'],
        },
        leido: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export default mongoose.model('Contact', contactSchema);
