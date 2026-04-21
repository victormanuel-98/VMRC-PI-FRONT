// Rutas de valoraciones: CRUD de valoraciones de recetas
import express from 'express';
import {
    crearValoracion,
    obtenerValoraciones,
    obtenerValoracionUsuario,
    actualizarValoracion,
    eliminarValoracion,
} from '../controllers/ratingController.js';
import { autenticar } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', autenticar, crearValoracion);
router.get('/:recetaId', obtenerValoraciones);
router.get('/:recetaId/usuario', autenticar, obtenerValoracionUsuario);
router.put('/:id', autenticar, actualizarValoracion);
router.delete('/:id', autenticar, eliminarValoracion);

export default router;
