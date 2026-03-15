// Controlador de contacto: gestiona el envío, consulta, marcado y eliminación de mensajes de contacto
import Contact from '../models/Contact.js';

export const enviarMensajeContacto = async (req, res) => {
    try {
        const { nombre, email, asunto, mensaje } = req.body;

        if (!nombre || !email || !asunto || !mensaje) {
            return res.status(400).json({ mensaje: 'Todos los campos son requeridos' });
        }
        const nuevoMensaje = new Contact({
            nombre,
            email,
            asunto,
            mensaje,
        });

        await nuevoMensaje.save();

        res.status(201).json({
            mensaje: 'Mensaje enviado exitosamente. Nos pondremos en contacto pronto.',
            id: nuevoMensaje._id,
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al enviar el mensaje', error: error.message });
    }
};

export const obtenerMensajes = async (req, res) => {
    try {
        const { pagina = 1, limite = 10, leido } = req.query;
        const skip = (pagina - 1) * limite;
        const filtro = {};

        if (leido !== undefined) {
            filtro.leido = leido === 'true';
        }

        const mensajes = await Contact.find(filtro)
            .skip(skip)
            .limit(parseInt(limite))
            .sort({ createdAt: -1 });

        const total = await Contact.countDocuments(filtro);

        res.status(200).json({
            mensajes,
            paginaActual: parseInt(pagina),
            totalPaginas: Math.ceil(total / limite),
            total,
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener mensajes', error: error.message });
    }
};

export const marcarComoLeido = async (req, res) => {
    try {
        const { id } = req.params;

        const mensaje = await Contact.findByIdAndUpdate(
            id,
            { leido: true },
            { new: true }
        );

        if (!mensaje) {
            return res.status(404).json({ mensaje: 'Mensaje no encontrado' });
        }

        res.status(200).json({
            mensaje: 'Mensaje marcado como leído',
            contacto: mensaje,
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al marcar como leído', error: error.message });
    }
};

export const eliminarMensaje = async (req, res) => {
    try {
        const { id } = req.params;

        const mensaje = await Contact.findByIdAndDelete(id);

        if (!mensaje) {
            return res.status(404).json({ mensaje: 'Mensaje no encontrado' });
        }

        res.status(200).json({ mensaje: 'Mensaje eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar mensaje', error: error.message });
    }
};
