// Script para listar usuarios y mostrar si la contraseña está hasheada
import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/fitfood';

const userSchema = new mongoose.Schema({
    usuario: String,
    email: String,
    nombre: String,
    apellidos: String,
    contrasena: String,
    foto: String,
    biografia: String,
    rol: String,
    activo: Boolean,
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function checkPasswords() {
    await mongoose.connect(MONGO_URI);
    const users = await User.find({});

    for (const user of users) {
        const isHashed = user.contrasena && user.contrasena.length >= 60;
        console.log(`Usuario: ${user.usuario} | Hasheada: ${isHashed ? 'Sí' : 'No'} | Contraseña: ${user.contrasena}`);
    }
    await mongoose.disconnect();
}

checkPasswords().catch(console.error);
