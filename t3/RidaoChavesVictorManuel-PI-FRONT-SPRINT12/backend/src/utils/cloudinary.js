// Utilidad para subir imágenes a Cloudinary
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const subirImagen = async (archivoBase64, nombreCarpeta = 'fitfood') => {
    try {
        const resultado = await cloudinary.uploader.upload(archivoBase64, {
            folder: nombreCarpeta,
            resource_type: 'auto',
            quality: 'auto',
        });

        return {
            url: resultado.secure_url,
            publicId: resultado.public_id,
        };
    } catch (error) {
        throw new Error(`Error al subir imagen: ${error.message}`);
    }
};

export const eliminarImagen = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
        return true;
    } catch (error) {
        throw new Error(`Error al eliminar imagen: ${error.message}`);
    }
};
