// Rutas de IA: gestiona el chat con el asistente FitFood
import express from 'express';
import { chatConIA } from '../controllers/aiController.js';
import { autenticar } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/chat', autenticar, chatConIA);

export default router;
