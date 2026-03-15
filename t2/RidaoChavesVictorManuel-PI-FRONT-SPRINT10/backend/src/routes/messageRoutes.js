import express from 'express';
import { enviarMensaje, obtenerMensajes, marcarComoLeido, eliminarMensaje } from '../controllers/messageController.js';
import { autenticar } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Ruta pública para contacto o privada para mensajes entre usuarios
router.post('/', (req, res, next) => {
    // Si hay token, lo autenticamos opcionalmente o simplemente dejamos que el controller maneje req.usuario
    next();
}, enviarMensaje);

// Rutas protegidas
router.get('/', autenticar, obtenerMensajes);
router.put('/:id/leido', autenticar, marcarComoLeido);
router.delete('/:id', autenticar, eliminarMensaje);

export default router;
