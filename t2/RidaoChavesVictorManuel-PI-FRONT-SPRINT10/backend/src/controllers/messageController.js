import Message from '../models/Message.js';

export const enviarMensaje = async (req, res) => {
    try {
        const { nombre, email, asunto, contenido, receptorId } = req.body;
        const senderId = req.usuario ? req.usuario.id : null;

        const nuevoMensaje = new Message({
            sender: senderId,
            nombre: senderId ? undefined : nombre,
            email: senderId ? undefined : email,
            receptor: receptorId || null,
            asunto,
            contenido
        });

        await nuevoMensaje.save();

        res.status(201).json({
            mensaje: 'Mensaje enviado exitosamente',
            id: nuevoMensaje._id
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al enviar el mensaje', error: error.message });
    }
};

export const obtenerMensajes = async (req, res) => {
    try {
        const { leido, tipo } = req.query; // tipo: 'enviados', 'recibidos'
        const userId = req.usuario.id;
        const filtro = {};

        if (tipo === 'enviados') {
            filtro.sender = userId;
        } else if (tipo === 'recibidos') {
            filtro.receptor = userId;
        } else if (req.usuario.rol === 'admin') {
            // Admin ve todo el sistema o mensajes al sistema (receptor: null)
            if (tipo === 'sistema') filtro.receptor = null;
        } else {
            // Usuario normal solo ve sus recibidos por defecto
            filtro.receptor = userId;
        }

        if (leido !== undefined) {
            filtro.leido = leido === 'true';
        }

        const mensajes = await Message.find(filtro)
            .populate('sender', 'usuario nombre foto')
            .populate('receptor', 'usuario nombre foto')
            .sort({ createdAt: -1 });

        res.status(200).json(mensajes);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener mensajes', error: error.message });
    }
};

export const marcarComoLeido = async (req, res) => {
    try {
        const { id } = req.params;
        const mensaje = await Message.findById(id);

        if (!mensaje) {
            return res.status(404).json({ mensaje: 'Mensaje no encontrado' });
        }

        // Solo el receptor o un admin puede marcar como leído
        if (mensaje.receptor && mensaje.receptor.toString() !== req.usuario.id && req.usuario.rol !== 'admin') {
            return res.status(403).json({ mensaje: 'No autorizado' });
        }

        mensaje.leido = true;
        await mensaje.save();

        res.status(200).json({ mensaje: 'Mensaje marcado como leído', data: mensaje });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar mensaje', error: error.message });
    }
};

export const eliminarMensaje = async (req, res) => {
    try {
        const { id } = req.params;
        const mensaje = await Message.findById(id);

        if (!mensaje) {
            return res.status(404).json({ mensaje: 'Mensaje no encontrado' });
        }

        // Solo el emisor, receptor o un admin pueden eliminar
        const esEmisor = mensaje.sender && mensaje.sender.toString() === req.usuario.id;
        const esReceptor = mensaje.receptor && mensaje.receptor.toString() === req.usuario.id;

        if (!esEmisor && !esReceptor && req.usuario.rol !== 'admin') {
            return res.status(403).json({ mensaje: 'No autorizado' });
        }

        await Message.findByIdAndDelete(id);
        res.status(200).json({ mensaje: 'Mensaje eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar mensaje', error: error.message });
    }
};
