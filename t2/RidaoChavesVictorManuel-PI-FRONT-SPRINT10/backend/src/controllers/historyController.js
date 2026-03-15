// Controlador de historial: gestiona el registro de alimentos consumidos por fecha y usuario
import History from '../models/History.js';

export const crearOActualizarHistorial = async (req, res) => {
    try {
        const { fecha, alimentos } = req.body;
        const usuarioId = req.usuario.id;

        if (!fecha || !alimentos || alimentos.length === 0) {
            return res.status(400).json({ mensaje: 'Fecha y alimentos son requeridos' });
        }

        const fechaFormato = new Date(fecha).toDateString();

        let historial = await History.findOne({
            usuario: usuarioId,
            fecha: { $gte: new Date(fecha), $lt: new Date(new Date(fecha).getTime() + 86400000) },
        });

        let totalCalorias = 0;
        let totalProteinas = 0;
        let totalGrasas = 0;
        let totalCarbohidratos = 0;

        alimentos.forEach((alimento) => {
            totalCalorias += alimento.calorias || 0;
            totalProteinas += alimento.proteinas || 0;
            totalGrasas += alimento.grasas || 0;
            totalCarbohidratos += alimento.carbohidratos || 0;
        });

        if (!historial) {
            historial = new History({
                usuario: usuarioId,
                fecha: new Date(fecha),
                alimentos,
                totalCalorias: Math.round(totalCalorias),
                totalProteinas: Math.round(totalProteinas),
                totalGrasas: Math.round(totalGrasas),
                totalCarbohidratos: Math.round(totalCarbohidratos),
            });
        } else {
            historial.alimentos = alimentos;
            historial.totalCalorias = Math.round(totalCalorias);
            historial.totalProteinas = Math.round(totalProteinas);
            historial.totalGrasas = Math.round(totalGrasas);
            historial.totalCarbohidratos = Math.round(totalCarbohidratos);
        }

        await historial.save();

        res.status(200).json({
            mensaje: 'Historial actualizado',
            historial,
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar historial', error: error.message });
    }
};

export const obtenerHistorial = async (req, res) => {
    try {
        const { fecha } = req.query;
        const usuarioId = req.usuario.id;

        if (!fecha) {
            return res.status(400).json({ mensaje: 'Fecha requerida' });
        }

        const historial = await History.findOne({
            usuario: usuarioId,
            fecha: { $gte: new Date(fecha), $lt: new Date(new Date(fecha).getTime() + 86400000) },
        })
            .populate('alimentos.receta')
            .populate('alimentos.ingrediente');

        if (!historial) {
            return res.status(404).json({ mensaje: 'No hay historial para esta fecha' });
        }

        res.status(200).json(historial);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener historial', error: error.message });
    }
};

export const obtenerHistorialRango = async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.query;
        const usuarioId = req.usuario.id;

        if (!fechaInicio || !fechaFin) {
            return res.status(400).json({ mensaje: 'Fecha de inicio y fin requeridas' });
        }

        const historial = await History.find({
            usuario: usuarioId,
            fecha: {
                $gte: new Date(fechaInicio),
                $lte: new Date(new Date(fechaFin).getTime() + 86400000),
            },
        })
            .populate('alimentos.receta')
            .populate('alimentos.ingrediente')
            .sort({ fecha: 1 });

        res.status(200).json(historial);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener historial', error: error.message });
    }
};

export const eliminarAlimentoHistorial = async (req, res) => {
    try {
        const { historialId, alimentoIndex } = req.params;
        const usuarioId = req.usuario.id;

        const historial = await History.findById(historialId);
        if (!historial) {
            return res.status(404).json({ mensaje: 'Historial no encontrado' });
        }

        if (historial.usuario.toString() !== usuarioId) {
            return res.status(403).json({ mensaje: 'No tienes permisos para modificar este historial' });
        }

        historial.alimentos.splice(alimentoIndex, 1);

        let totalCalorias = 0;
        let totalProteinas = 0;
        let totalGrasas = 0;
        let totalCarbohidratos = 0;

        historial.alimentos.forEach((alimento) => {
            totalCalorias += alimento.calorias || 0;
            totalProteinas += alimento.proteinas || 0;
            totalGrasas += alimento.grasas || 0;
            totalCarbohidratos += alimento.carbohidratos || 0;
        });

        historial.totalCalorias = Math.round(totalCalorias);
        historial.totalProteinas = Math.round(totalProteinas);
        historial.totalGrasas = Math.round(totalGrasas);
        historial.totalCarbohidratos = Math.round(totalCarbohidratos);

        await historial.save();

        res.status(200).json({
            mensaje: 'Alimento eliminado del historial',
            historial,
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar alimento', error: error.message });
    }
};
