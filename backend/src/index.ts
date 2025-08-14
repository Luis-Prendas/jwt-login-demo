import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { PORT } from './config/env';
import userSessionRoutes from './routes/userSession';
import userRoutes from './routes/user';
import tabsMenuRoutes from './routes/tabsMenu';
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
app.use('/api', userSessionRoutes);
app.use('/api', userRoutes);
app.use('/api', tabsMenuRoutes);

// Lógica de sockets
io.on('connection', (socket) => {
  roomHandler(io, socket);
});

httpServer.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
