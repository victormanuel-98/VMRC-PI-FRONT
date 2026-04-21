// Controlador de favoritos: permite agregar, consultar y eliminar recetas favoritas de un usuario
import Favorite from '../models/Favorite.js';

export const agregarFavorito = async (req, res) => {
    try {
        const { recetaId } = req.body;
        const usuarioId = req.usuario.id;

        if (!recetaId) {
            return res.status(400).json({ mensaje: 'ID de receta requerido' });
        }

        const existente = await Favorite.findOne({ usuario: usuarioId, receta: recetaId });
        if (existente) {
            return res.status(400).json({ mensaje: 'Esta receta ya está en favoritos' });
        }

        const nuevoFavorito = new Favorite({
            usuario: usuarioId,
            receta: recetaId,
        });

        await nuevoFavorito.save();

        const favoritoConDatos = await Favorite.findById(nuevoFavorito._id)
            .populate('usuario', 'usuario nombre email foto')
            .populate({
                path: 'receta',
                select: 'nombre descripcionCorta categoria dificultad calorias imagen',
                populate: {
                    path: 'autor',
                    select: 'usuario nombre foto',
                },
            });

        res.status(201).json({
            mensaje: 'Receta agregada a favoritos',
            favorito: favoritoConDatos,
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al agregar favorito', error: error.message });
    }
};

export const obtenerFavoritos = async (req, res) => {
    try {
        const usuarioId = req.usuario.id;

        const favoritos = await Favorite.find({ usuario: usuarioId })
            .populate('usuario', 'usuario nombre email foto')
            .populate({
                path: 'receta',
                select: 'nombre descripcionCorta categoria dificultad calorias imagen',
                populate: {
                    path: 'autor',
                    select: 'usuario nombre foto',
                },
            })
            .sort({ createdAt: -1 });

        res.status(200).json(favoritos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener favoritos', error: error.message });
    }
};

export const eliminarFavorito = async (req, res) => {
    try {
        const { recetaId } = req.params;
        const usuarioId = req.usuario.id;

        const favorito = await Favorite.findOneAndDelete({
            usuario: usuarioId,
            receta: recetaId,
        });

        if (!favorito) {
            return res.status(404).json({ mensaje: 'Favorito no encontrado' });
        }

        res.status(200).json({ mensaje: 'Receta eliminada de favoritos' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar favorito', error: error.message });
    }
};
