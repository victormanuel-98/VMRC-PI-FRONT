// Rutas de historial: crear, consultar, eliminar alimentos del historial
import express from 'express';
import {
    crearOActualizarHistorial,
    obtenerHistorial,
    obtenerHistorialRango,
    eliminarAlimentoHistorial,
} from '../controllers/historyController.js';
import { autenticar } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', autenticar, crearOActualizarHistorial);
router.get('/', autenticar, obtenerHistorial);
router.get('/rango', autenticar, obtenerHistorialRango);
router.delete('/:historialId/alimento/:alimentoIndex', autenticar, eliminarAlimentoHistorial);

export default router;
