import express, { Request, Response } from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { PORT } from './config/env';
import userRoutes from './routes/user.routes';
import tabsMenuRoutes from './routes/tabsMenu.routes';
import { socketAuth } from './middlewares/socketAuth';
import { handleRoomEvents } from './sockets/roomHandler';
import userSessionRouter from './routes/userSession.routes';
import handleWebRTCEvents from './sockets/webrtcHandler';
import assistanceRouter from './routes/assistance.routes';

// Crear instancia de Express
const app = express();

// Crear servidor HTTP a partir de Express
const httpServer = createServer(app);

// Configurar Socket.IO
const io = new Server(httpServer, {
  cors: { origin: '*' }, // Permitir cualquier origen (CORS)
});

// Middleware global para sockets: autenticación de usuarios
io.use(socketAuth);

// Middlewares globales de Express
app.use(cors());
app.use(express.json()); // Parsear JSON en el body de requests

// Ruta de prueba /healthcheck
app.get('/', (_req: Request, res: Response) => {
  res.send('🚀 API con JWT en TypeScript funcionando correctamente!');
});

// Rutas de la API
app.use('/api/sessions', userSessionRouter); // login, registro, logout
app.use('/api/users', userRoutes);           // gestión de usuarios
app.use('/api/tabs', tabsMenuRoutes);        // configuración de menú/tab
app.use('/api/assistance', assistanceRouter);        // configuración de asistencia

// Configuración de sockets
io.on('connection', (socket: Socket) => {
  console.log(`⚡ Nuevo cliente conectado: ${socket.id}`);
  handleRoomEvents(io, socket); // Manejo de eventos de salas
  handleWebRTCEvents(io, socket); // Manejo de eventos WebRTC
});

// Iniciar servidor HTTP
httpServer.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});