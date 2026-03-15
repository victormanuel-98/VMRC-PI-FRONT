// Rutas de usuario: consulta y actualización de perfil
import express from 'express';
import { obtenerPerfil, actualizarPerfil, eliminarUsuario } from '../controllers/userController.js';
import { autenticar } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Obtener perfil de usuario
router.get('/:id', autenticar, obtenerPerfil);

// Actualizar perfil de usuario
router.put('/:id', autenticar, actualizarPerfil);

// Eliminar usuario (admin)
router.delete('/:id', autenticar, eliminarUsuario);

export default router;
