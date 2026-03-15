// Rutas de recetas: CRUD de recetas y consulta por usuario
import express from 'express';
import {
    crearReceta,
    obtenerRecetas,
    obtenerReceta,
    obtenerRecetasUsuario,
    actualizarReceta,
    eliminarReceta,
} from '../controllers/recipeController.js';
import { autenticar } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/recetas:
 *   post:
 *     summary: Crear una nueva receta
 *     tags: [Recetas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               ingredientes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     ingrediente:
 *                       type: string
 *                     cantidad:
 *                       type: number
 *               descripcionCorta:
 *                 type: string
 *               descripcionLarga:
 *                 type: string
 *               dificultad:
 *                 type: string
 *                 enum: [facil, medio, dificil]
 *               categoria:
 *                 type: string
 *                 enum: [desayuno, almuerzo, cena, snack, postre]
 *     responses:
 *       201:
 *         description: Receta creada correctamente
 *       400:
 *         description: Error en los datos enviados
 */
router.post('/', autenticar, crearReceta);
/**
 * @swagger
 * /api/recetas:
 *   get:
 *     summary: Obtener todas las recetas
 *     tags: [Recetas]
 *     responses:
 *       200:
 *         description: Lista de recetas
 */
router.get('/', obtenerRecetas);
/**
 * @swagger
 * /api/recetas/{id}:
 *   get:
 *     summary: Obtener una receta por ID
 *     tags: [Recetas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la receta
 *     responses:
 *       200:
 *         description: Receta encontrada
 *       404:
 *         description: Receta no encontrada
 */
router.get('/:id', obtenerReceta);
/**
 * @swagger
 * /api/recetas/usuario/{usuarioId}:
 *   get:
 *     summary: Obtener recetas de un usuario
 *     tags: [Recetas]
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de recetas del usuario
 */
router.get('/usuario/:usuarioId', obtenerRecetasUsuario);
/**
 * @swagger
 * /api/recetas/{id}:
 *   put:
 *     summary: Actualizar una receta
 *     tags: [Recetas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la receta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Receta actualizada correctamente
 *       400:
 *         description: Error en los datos enviados
 *       404:
 *         description: Receta no encontrada
 */
router.put('/:id', autenticar, actualizarReceta);
/**
 * @swagger
 * /api/recetas/{id}:
 *   delete:
 *     summary: Eliminar una receta
 *     tags: [Recetas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la receta
 *     responses:
 *       200:
 *         description: Receta eliminada correctamente
 *       404:
 *         description: Receta no encontrada
 */
router.delete('/:id', autenticar, eliminarReceta);

export default router;
