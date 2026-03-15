// Controlador de ingredientes: permite crear, consultar, actualizar y eliminar ingredientes
import Ingredient from '../models/Ingredient.js';

export const crearIngrediente = async (req, res) => {
    try {
        const { nombre, calorias, unidad, proteinas, grasas, carbohidratos, descripcion } = req.body;

        if (!nombre || calorias === undefined) {
            return res.status(400).json({ mensaje: 'Nombre y calorías son requeridos' });
        }

        const existente = await Ingredient.findOne({ nombre: nombre.trim() });
        if (existente) {
            return res.status(400).json({ mensaje: 'El ingrediente ya existe' });
        }

        const nuevo = new Ingredient({
            nombre: nombre.trim(),
            calorias,
            unidad: unidad || 'g',
            proteinas: proteinas || 0,
            grasas: grasas || 0,
            carbohidratos: carbohidratos || 0,
            descripcion: descripcion || '',
        });

        await nuevo.save();

        res.status(201).json({ mensaje: 'Ingrediente creado', ingrediente: nuevo });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear ingrediente', error: error.message });
    }
};

export const obtenerIngredientes = async (req, res) => {
    try {
        const { q, pagina = 1, limite = 20 } = req.query;
        const filtro = {};

        if (q) {
            filtro.nombre = { $regex: q, $options: 'i' };
        }

        const skip = (pagina - 1) * limite;

        const ingredientes = await Ingredient.find(filtro)
            .skip(skip)
            .limit(parseInt(limite))
            .sort({ nombre: 1 });

        const total = await Ingredient.countDocuments(filtro);

        res.status(200).json({
            ingredientes,
            paginaActual: parseInt(pagina),
            totalPaginas: Math.ceil(total / limite),
            total,
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener ingredientes', error: error.message });
    }
};

export const obtenerIngrediente = async (req, res) => {
    try {
        const { id } = req.params;
        const ingrediente = await Ingredient.findById(id);

        if (!ingrediente) {
            return res.status(404).json({ mensaje: 'Ingrediente no encontrado' });
        }

        res.status(200).json(ingrediente);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener ingrediente', error: error.message });
    }
};

export const actualizarIngrediente = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, calorias, unidad, proteinas, grasas, carbohidratos, descripcion } = req.body;

        const ingrediente = await Ingredient.findById(id);
        if (!ingrediente) {
            return res.status(404).json({ mensaje: 'Ingrediente no encontrado' });
        }

        if (nombre) ingrediente.nombre = nombre.trim();
        if (calorias !== undefined) ingrediente.calorias = calorias;
        if (unidad) ingrediente.unidad = unidad;
        if (proteinas !== undefined) ingrediente.proteinas = proteinas;
        if (grasas !== undefined) ingrediente.grasas = grasas;
        if (carbohidratos !== undefined) ingrediente.carbohidratos = carbohidratos;
        if (descripcion !== undefined) ingrediente.descripcion = descripcion;

        await ingrediente.save();

        res.status(200).json({ mensaje: 'Ingrediente actualizado', ingrediente });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar ingrediente', error: error.message });
    }
};

export const eliminarIngrediente = async (req, res) => {
    try {
        const { id } = req.params;

        const ingrediente = await Ingredient.findByIdAndDelete(id);
        if (!ingrediente) {
            return res.status(404).json({ mensaje: 'Ingrediente no encontrado' });
        }

        res.status(200).json({ mensaje: 'Ingrediente eliminado' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar ingrediente', error: error.message });
    }
};
