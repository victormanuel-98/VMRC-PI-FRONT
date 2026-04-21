// socketServer.js - Configura el servidor HTTP y Socket.io para notificaciones en tiempo real.
import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 5000;
connectDB();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
        credentials: true,
    },
});

io.on('connection', (socket) => {
    console.log('Usuario conectado:', socket.id);
});

app.set('io', io);

server.listen(PORT, () => {
    console.log(`Servidor FitFood escuchando en puerto ${PORT}`);
    console.log(`Entorno: ${process.env.NODE_ENV || 'development'}`);
});
