// Controlador de valoraciones: gestiona la creación, consulta, actualización y eliminación de valoraciones de recetas
import Rating from '../models/Rating.js';
import Recipe from '../models/Recipe.js';

export const crearValoracion = async (req, res) => {
    try {
        const { recetaId, puntuacion, comentario } = req.body;
        const usuarioId = req.usuario.id;

        if (!recetaId || !puntuacion) {
            return res.status(400).json({ mensaje: 'ID de receta y puntuación requeridos' });
        }

        if (puntuacion < 1 || puntuacion > 5) {
            return res.status(400).json({ mensaje: 'La puntuación debe estar entre 1 y 5' });
        }

        const existente = await Rating.findOne({ usuario: usuarioId, receta: recetaId });
        if (existente) {
            return res.status(400).json({ mensaje: 'Ya has valorado esta receta' });
        }

        const nuevaValoracion = new Rating({
            usuario: usuarioId,
            receta: recetaId,
            puntuacion,
            comentario: comentario || '',
        });

        await nuevaValoracion.save();
        // Emitir evento websocket
        if (req.app && req.app.get) {
            const io = req.app.get('io');
            if (io) {
                io.emit('nuevaValoracion', { valoracion: nuevaValoracion });
            }
        }

        await actualizarPuntuacionReceta(recetaId);

        res.status(201).json({
            mensaje: 'Valoración registrada exitosamente',
            valoracion: nuevaValoracion,
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear valoración', error: error.message });
    }
};

export const obtenerValoraciones = async (req, res) => {
    try {
        const { recetaId } = req.params;

        const valoraciones = await Rating.find({ receta: recetaId })
            .populate('usuario', 'usuario nombre foto')
            .sort({ createdAt: -1 });

        res.status(200).json(valoraciones);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener valoraciones', error: error.message });
    }
};

export const obtenerValoracionUsuario = async (req, res) => {
    try {
        const { recetaId } = req.params;
        const usuarioId = req.usuario.id;

        const valoracion = await Rating.findOne({ usuario: usuarioId, receta: recetaId });

        if (!valoracion) {
            return res.status(404).json({ mensaje: 'No has valorado esta receta' });
        }

        res.status(200).json(valoracion);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener valoración', error: error.message });
    }
};

export const actualizarValoracion = async (req, res) => {
    try {
        const { id } = req.params;
        const { puntuacion, comentario } = req.body;
        const usuarioId = req.usuario.id;

        const valoracion = await Rating.findById(id);
        if (!valoracion) {
            return res.status(404).json({ mensaje: 'Valoración no encontrada' });
        }

        if (valoracion.usuario.toString() !== usuarioId) {
            return res.status(403).json({ mensaje: 'No tienes permisos para editar esta valoración' });
        }

        if (puntuacion && (puntuacion < 1 || puntuacion > 5)) {
            return res.status(400).json({ mensaje: 'La puntuación debe estar entre 1 y 5' });
        }

        if (puntuacion) valoracion.puntuacion = puntuacion;
        if (comentario !== undefined) valoracion.comentario = comentario;

        const recetaId = valoracion.receta;
        await valoracion.save();

        await actualizarPuntuacionReceta(recetaId);

        res.status(200).json({
            mensaje: 'Valoración actualizada exitosamente',
            valoracion,
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar valoración', error: error.message });
    }
};

export const eliminarValoracion = async (req, res) => {
    try {
        const { id } = req.params;
        const usuarioId = req.usuario.id;

        const valoracion = await Rating.findById(id);
        if (!valoracion) {
            return res.status(404).json({ mensaje: 'Valoración no encontrada' });
        }

        if (valoracion.usuario.toString() !== usuarioId && req.usuario.rol !== 'admin') {
            return res.status(403).json({ mensaje: 'No tienes permisos para eliminar esta valoración' });
        }

        const recetaId = valoracion.receta;
        await Rating.findByIdAndDelete(id);

        await actualizarPuntuacionReceta(recetaId);

        res.status(200).json({ mensaje: 'Valoración eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar valoración', error: error.message });
    }
};

const actualizarPuntuacionReceta = async (recetaId) => {
    try {
        const valoraciones = await Rating.find({ receta: recetaId });

        if (valoraciones.length === 0) {
            await Recipe.findByIdAndUpdate(recetaId, {
                puntuacionPromedio: 0,
                totalValorations: 0,
            });
        } else {
            const suma = valoraciones.reduce((acc, val) => acc + val.puntuacion, 0);
            const promedio = (suma / valoraciones.length).toFixed(1);

            await Recipe.findByIdAndUpdate(recetaId, {
                puntuacionPromedio: promedio,
                totalValorations: valoraciones.length,
            });
        }
    } catch (error) {
        console.error('Error al actualizar puntuación:', error);
    }
};
