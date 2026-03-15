// Modelo User: almacena datos de usuario, email, contraseña y rol
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        usuario: {
            type: String,
            required: [true, 'El usuario es requerido'],
            unique: true,
            trim: true,
            minlength: [3, 'El usuario debe tener al menos 3 caracteres'],
        },
        email: {
            type: String,
            required: [true, 'El email es requerido'],
            unique: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor introduce un email válido'],
        },
        nombre: {
            type: String,
            required: [true, 'El nombre es requerido'],
            trim: true,
        },
        apellidos: {
            type: String,
            trim: true,
        },
        contrasena: {
            type: String,
            required: [true, 'La contraseña es requerida'],
            minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
            select: false,
        },
        foto: {
            type: String,
            default: null,
        },
        telefono: {
            type: String,
            default: null,
        },
        biografia: {
            type: String,
            default: '',
        },
        rol: {
            type: String,
            enum: ['usuario', 'nutricionista', 'admin'],
            default: 'usuario',
        },
        activo: {
            type: Boolean,
            default: true,
        },
        notificaciones: {
            type: Boolean,
            default: true,
        },
        visibilidad: {
            type: String,
            enum: ['publica', 'privada'],
            default: 'publica',
        },
    },
    { timestamps: true }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('contrasena')) {
        return next();
    }

    try {
        const salt = await bcryptjs.genSalt(10);
        this.contrasena = await bcryptjs.hash(this.contrasena, salt);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.compararContrasena = async function (contrasena) {
    return await bcryptjs.compare(contrasena, this.contrasena);
};

export default mongoose.model('User', userSchema);
