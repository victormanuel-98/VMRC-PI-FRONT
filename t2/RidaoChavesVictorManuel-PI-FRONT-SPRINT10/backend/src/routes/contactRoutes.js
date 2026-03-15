// Rutas de contacto: envío, consulta, marcado y eliminación de mensajes
import express from 'express';
import {
    enviarMensajeContacto,
    obtenerMensajes,
    marcarComoLeido,
    eliminarMensaje,
} from '../controllers/contactController.js';
import { autenticar, soloAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', enviarMensajeContacto);
router.get('/', autenticar, soloAdmin, obtenerMensajes);
router.put('/:id/leido', autenticar, soloAdmin, marcarComoLeido);
router.delete('/:id', autenticar, soloAdmin, eliminarMensaje);

export default router;
