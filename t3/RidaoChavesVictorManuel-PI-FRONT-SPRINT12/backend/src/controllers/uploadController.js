// Controlador de subida de imágenes: gestiona la subida de imágenes de recetas y perfiles a Cloudinary
import { subirImagen } from '../utils/cloudinary.js';

export const subirImagenReceta = async (req, res) => {
    try {
        const { imagen } = req.body;

        if (!imagen) {
            return res.status(400).json({ mensaje: 'No se proporcionó imagen' });
        }

        if (!imagen.startsWith('data:image')) {
            return res.status(400).json({ mensaje: 'Imagen inválida' });
        }

        const resultado = await subirImagen(imagen, 'fitfood/recetas');

        res.status(200).json({
            mensaje: 'Imagen subida correctamente',
            url: resultado.url,
            publicId: resultado.publicId,
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al subir imagen', error: error.message });
    }
};

export const subirImagenPerfil = async (req, res) => {
    try {
        const { imagen } = req.body;

        if (!imagen) {
            return res.status(400).json({ mensaje: 'No se proporcionó imagen' });
        }

        if (!imagen.startsWith('data:image')) {
            return res.status(400).json({ mensaje: 'Imagen inválida' });
        }

        const resultado = await subirImagen(imagen, 'fitfood/perfiles');

        res.status(200).json({
            mensaje: 'Imagen subida correctamente',
            url: resultado.url,
            publicId: resultado.publicId,
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al subir imagen', error: error.message });
    }
};
