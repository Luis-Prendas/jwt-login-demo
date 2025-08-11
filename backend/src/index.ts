import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { PORT } from './config/env';
import userSessionRoutes from './routes/userSession';
import userRoutes from './routes/user';
import { socketAuth } from './middlewares/socketAuth';
import { roomHandler } from './sockets/roomHandler';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: '*' }
});

// Middleware global para sockets (autenticación)
io.use(socketAuth);

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => res.send('🚀 API con JWT en TS funcionando!'));
app.use('/', userSessionRoutes);
app.use('/', userRoutes);

// Lógica de sockets
io.on('connection', (socket) => {
  roomHandler(io, socket);
});

httpServer.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
