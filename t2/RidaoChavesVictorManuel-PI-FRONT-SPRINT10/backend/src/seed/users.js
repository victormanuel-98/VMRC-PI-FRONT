// Script de seed: carga usuarios iniciales en la base de datos
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';

dotenv.config();

const usuarios = [
    {
        usuario: 'admin_fitfood',
        email: 'admin@fitfood.com',
        nombre: 'Admin',
        apellidos: 'FitFood',
        contrasena: 'Admin123!',
        rol: 'admin',
    },
    {
        usuario: 'nutri_fitfood',
        email: 'nutricionista@fitfood.com',
        nombre: 'Nutricionista',
        apellidos: 'FitFood',
        contrasena: 'Admin123!',
        rol: 'nutricionista',
    },
    {
        usuario: 'victor_98',
        email: 'victor@example.com',
        nombre: 'Víctor',
        apellidos: 'Ridao Chaves',
        contrasena: 'Admin123!',
        rol: 'usuario',
    },
    {
        usuario: 'maria_fit',
        email: 'maria@example.com',
        nombre: 'María',
        apellidos: 'López',
        contrasena: 'Admin123!',
        rol: 'usuario',
    },
    {
        usuario: 'juan_healthy',
        email: 'juan@example.com',
        nombre: 'Juan',
        apellidos: 'García',
        contrasena: 'Admin123!',
        rol: 'usuario',
    },
];

const seedUsuarios = async () => {
    try {
        await connectDB();
        await User.deleteMany();
        await User.insertMany(usuarios);
        console.log('Usuarios insertados correctamente');
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Error al insertar usuarios:', error);
        process.exit(1);
    }
};

seedUsuarios();
