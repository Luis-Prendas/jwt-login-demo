import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { PORT } from './config/env';
import app from './app';
import { socketAuth } from './middlewares/socketAuth';
import { handleRoomEvents } from './sockets/roomHandler';
import handleWebRTCEvents from './sockets/webrtcHandler';

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

io.use(socketAuth);

io.on('connection', (socket: Socket) => {
  console.log(`⚡ Nuevo cliente conectado: ${socket.id}`);
  handleRoomEvents(io, socket);
  handleWebRTCEvents(io, socket);
});

httpServer.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
