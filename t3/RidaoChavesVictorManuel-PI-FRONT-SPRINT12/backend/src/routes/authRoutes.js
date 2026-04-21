/**
 * @swagger
 * /api/auth/delete:
 *   delete:
 *     summary: Eliminar usuario autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: "Token JWT Bearer. Ejemplo: 'Bearer {token}'"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuario:
 *                 type: string
 *               contrasena:
 *                 type: string
 *               confirmacion:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *       400:
 *         description: Datos inválidos o confirmación faltante
 *       401:
 *         description: Token inválido o usuario no autorizado
 */


import express from 'express';
import { registrar, login, verificarToken, eliminarUsuario } from '../controllers/userController.js';
import { autenticar } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.delete('/delete', autenticar, eliminarUsuario);

/**
 * @swagger
 * /api/auth/registro:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuario:
 *                 type: string
 *               email:
 *                 type: string
 *               nombre:
 *                 type: string
 *               apellidos:
 *                 type: string
 *               contrasena:
 *                 type: string
 *               rol:
 *                 type: string
 *                 enum: [usuario, nutricionista, admin]
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *       400:
 *         description: Error en los datos enviados
 */
router.post('/registro', registrar);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login de usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuario:
 *                 type: string
 *               contrasena:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso
 *       401:
 *         description: Usuario o contraseña incorrectos
 */
router.post('/login', login);
/**
 * @swagger
 * /api/auth/verificar:
 *   get:
 *     summary: Verificar token de usuario
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token válido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valido:
 *                   type: boolean
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     usuario:
 *                       type: string
 *                     email:
 *                       type: string
 *                     nombre:
 *                       type: string
 *                     rol:
 *                       type: string
 *       401:
 *         description: Token inválido o expirado
 */
router.get('/verificar', autenticar, verificarToken);

export default router;
