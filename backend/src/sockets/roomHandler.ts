import { Server, Socket } from 'socket.io';
import { nanoid } from 'nanoid';

export function roomHandler(io: Server, socket: Socket) {
  console.log(`User connected: ${socket.id}, username: ${(socket as any).user?.username}`);

  // Crear sala
  socket.on('createRoom', (_, callback) => {
    const roomId = nanoid(8);
    socket.join(roomId);
    callback(roomId);
    console.log(`Room created: ${roomId} by ${(socket as any).user?.username}`);
  });

  // Unirse a sala
  socket.on('joinRoom', (roomId, callback) => {
    const room = io.sockets.adapter.rooms.get(roomId);
    if (!room) {
      callback(`Room ${roomId} does not exist`);
      return;
    }

    socket.join(roomId);
    callback(`Joined room ${roomId}`);
    socket.to(roomId).emit('userJoined', {
      id: socket.id,
      user: (socket as any).user?.username
    });
  });

  // Mensaje en sala
  socket.on('chatMessage', ({ roomId, message }) => {
    io.to(roomId).emit('chatMessage', {
      id: socket.id,
      user: (socket as any).user?.username,
      message
    });
  });
}
