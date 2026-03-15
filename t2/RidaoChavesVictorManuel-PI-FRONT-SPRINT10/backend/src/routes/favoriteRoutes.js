// Rutas de favoritos: agregar, consultar y eliminar recetas favoritas
import express from 'express';
import {
    agregarFavorito,
    obtenerFavoritos,
    eliminarFavorito,
} from '../controllers/favoriteController.js';
import { autenticar } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', autenticar, agregarFavorito);
router.get('/', autenticar, obtenerFavoritos);
router.delete('/:recetaId', autenticar, eliminarFavorito);

export default router;
