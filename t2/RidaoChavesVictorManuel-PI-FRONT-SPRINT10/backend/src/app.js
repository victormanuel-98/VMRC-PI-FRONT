// app.js - Configura la aplicación Express, middlewares, rutas y manejo global de errores.
import express from 'express';
import cors from 'cors';
import swaggerSetup from './swagger.js';
import helmet from 'helmet';
import 'express-async-errors';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import ratingRoutes from './routes/ratingRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import ingredientRoutes from './routes/ingredientRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

const app = express();

// Middlewares de seguridad
app.use(helmet());

app.use(
    cors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
        credentials: true,
    })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
swaggerSetup(app);
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/recetas', recipeRoutes);
app.use('/api/historial', historyRoutes);
app.use('/api/favoritos', favoriteRoutes);
app.use('/api/valoraciones', ratingRoutes);
app.use('/api/mensajes', messageRoutes);
app.use('/api/ingredientes', ingredientRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/ai', aiRoutes);
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});
app.get('/api/health', (req, res) => {
    res.status(200).json({ mensaje: 'Backend de FitFood funcionando correctamente' });
});
app.use((req, res) => {
    res.status(404).json({ mensaje: 'Ruta no encontrada' });
});
app.use((error, req, res, next) => {
    if (process.env.NODE_ENV === 'development') {
        console.error('Error:', error);
    }
    res.status(500).json({
        mensaje: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
});

export default app;
