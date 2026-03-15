// Controlador de recetas: permite crear, consultar, actualizar y eliminar recetas
// Calcula valores nutricionales a partir de ingredientes
import Recipe from '../models/Recipe.js';
import Ingredient from '../models/Ingredient.js';

const calcularCalorias = async (ingredientes) => {
    let totalCalorias = 0;
    let totalProteinas = 0;
    let totalGrasas = 0;
    let totalCarbohidratos = 0;

    for (const item of ingredientes) {
        const ingrediente = await Ingredient.findById(item.ingrediente);
        if (ingrediente) {
            const cantidad = item.cantidad;
            totalCalorias += (ingrediente.calorias * cantidad) / 100;
            totalProteinas += (ingrediente.proteinas * cantidad) / 100;
            totalGrasas += (ingrediente.grasas * cantidad) / 100;
            totalCarbohidratos += (ingrediente.carbohidratos * cantidad) / 100;
        }
    }

    return { totalCalorias, totalProteinas, totalGrasas, totalCarbohidratos };
};

export const crearReceta = async (req, res) => {
    try {
        const { nombre, descripcionCorta, descripcionLarga, dificultad, ingredientes, categoria, tiempoPreparacion } = req.body;
        const autorId = req.usuario.id;

        if (!nombre || !descripcionCorta || !dificultad || !ingredientes || !categoria) {
            return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
        }

        const esOficial = req.usuario.rol !== 'usuario';
        const { totalCalorias, totalProteinas, totalGrasas, totalCarbohidratos } = await calcularCalorias(ingredientes);

        const nuevaReceta = new Recipe({
            nombre,
            autor: autorId,
            descripcionCorta,
            descripcionLarga,
            dificultad,
            ingredientes,
            categoria,
            tiempoPreparacion: tiempoPreparacion || 0,
            calorias: Math.round(totalCalorias),
            proteinas: Math.round(totalProteinas),
            grasas: Math.round(totalGrasas),
            carbohidratos: Math.round(totalCarbohidratos),
            esOficial,
        });

        if (req.body.imagen) {
            nuevaReceta.imagen = req.body.imagen;
        }

        await nuevaReceta.save();
        // Emitir evento websocket
        if (req.app && req.app.get) {
            const io = req.app.get('io');
            if (io) {
                io.emit('nuevaReceta', { receta: nuevaReceta });
            }
        }

        res.status(201).json({
            mensaje: 'Receta creada exitosamente',
            receta: nuevaReceta,
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear receta', error: error.message });
    }
};

export const obtenerRecetas = async (req, res) => {
    try {
        const { categoria, dificultad, pagina = 1, limite = 10 } = req.query;
        const filtro = {};

        if (categoria) filtro.categoria = categoria;
        if (dificultad) filtro.dificultad = dificultad;

        const skip = (pagina - 1) * limite;

        const recetas = await Recipe.find(filtro)
            .populate('autor', 'usuario nombre foto')
            .populate('ingredientes.ingrediente')
            .skip(skip)
            .limit(parseInt(limite))
            .sort({ createdAt: -1 });

        const total = await Recipe.countDocuments(filtro);

        res.status(200).json({
            recetas,
            paginaActual: parseInt(pagina),
            totalPaginas: Math.ceil(total / limite),
            total,
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener recetas', error: error.message });
    }
};

export const obtenerReceta = async (req, res) => {
    try {
        const { id } = req.params;

        const receta = await Recipe.findById(id)
            .populate('autor', 'usuario nombre foto')
            .populate('ingredientes.ingrediente');

        if (!receta) {
            return res.status(404).json({ mensaje: 'Receta no encontrada' });
        }

        res.status(200).json(receta);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener receta', error: error.message });
    }
};

export const obtenerRecetasUsuario = async (req, res) => {
    try {
        const { usuarioId } = req.params;
        const recetas = await Recipe.find({ autor: usuarioId })
            .populate('ingredientes.ingrediente')
            .sort({ createdAt: -1 });

        res.status(200).json(recetas);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener recetas del usuario', error: error.message });
    }
};

export const actualizarReceta = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcionCorta, descripcionLarga, dificultad, ingredientes, categoria, tiempoPreparacion } = req.body;

        const receta = await Recipe.findById(id);
        if (!receta) {
            return res.status(404).json({ mensaje: 'Receta no encontrada' });
        }

        if (receta.autor.toString() !== req.usuario.id && req.usuario.rol !== 'admin') {
            return res.status(403).json({ mensaje: 'No tienes permisos para editar esta receta' });
        }
        if (nombre) receta.nombre = nombre;
        if (descripcionCorta) receta.descripcionCorta = descripcionCorta;
        if (descripcionLarga !== undefined) receta.descripcionLarga = descripcionLarga;
        if (dificultad) receta.dificultad = dificultad;
        if (ingredientes) {
            receta.ingredientes = ingredientes;
            const { totalCalorias, totalProteinas, totalGrasas, totalCarbohidratos } = await calcularCalorias(ingredientes);
            receta.calorias = Math.round(totalCalorias);
            receta.proteinas = Math.round(totalProteinas);
            receta.grasas = Math.round(totalGrasas);
            receta.carbohidratos = Math.round(totalCarbohidratos);
        }
        if (categoria) receta.categoria = categoria;
        if (tiempoPreparacion !== undefined) receta.tiempoPreparacion = tiempoPreparacion;
        if (req.body.imagen) receta.imagen = req.body.imagen;

        await receta.save();

        res.status(200).json({
            mensaje: 'Receta actualizada exitosamente',
            receta,
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar receta', error: error.message });
    }
};

export const eliminarReceta = async (req, res) => {
    try {
        const { id } = req.params;

        const receta = await Recipe.findById(id);
        if (!receta) {
            return res.status(404).json({ mensaje: 'Receta no encontrada' });
        }

        if (receta.autor.toString() !== req.usuario.id && req.usuario.rol !== 'admin') {
            return res.status(403).json({ mensaje: 'No tienes permisos para eliminar esta receta' });
        }

        await Recipe.findByIdAndDelete(id);

        res.status(200).json({ mensaje: 'Receta eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar receta', error: error.message });
    }
};
