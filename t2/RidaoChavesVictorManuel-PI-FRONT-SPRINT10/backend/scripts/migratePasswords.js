// Script para migrar contraseñas en texto plano a hashes bcrypt
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

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

async function migratePasswords() {
    await mongoose.connect(MONGO_URI);
    const users = await User.find({});
    let updated = 0;

    for (const user of users) {
        // Si la contraseña parece estar en texto plano (menos de 60 caracteres)
        if (user.contrasena && user.contrasena.length < 60) {
            const salt = await bcryptjs.genSalt(10);
            const hash = await bcryptjs.hash(user.contrasena, salt);
            user.contrasena = hash;
            await user.save();
            updated++;
            console.log(`Usuario ${user.usuario} actualizado.`);
        }
    }
    console.log(`Contraseñas actualizadas: ${updated}`);
    await mongoose.disconnect();
}

migratePasswords().catch(console.error);
