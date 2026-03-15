import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false // Opcional para mensajes de contacto anónimos
        },
        nombre: { // Para cuando no hay sender (formulario contacto)
            type: String,
            required: function() { return !this.sender; }
        },
        email: { // Para cuando no hay sender (formulario contacto)
            type: String,
            required: function() { return !this.sender; }
        },
        receptor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false // Si es null, es para administración/sistema
        },
        asunto: {
            type: String,
            required: true,
            trim: true
        },
        contenido: {
            type: String,
            required: true,
            minlength: 2
        },
        leido: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

export default mongoose.model('Message', messageSchema);
