import { Server, Socket } from 'socket.io';
import { DB } from '../db/mockDB';

export function roomHandler(io: Server, socket: Socket) {
  // Unirse a sala
  socket.on('joinRoom', (roomId, callback) => {
    const room = DB.rooms.find(room => room.uuid === roomId);

    // Verificar si la sala existe.
    if (!room) {
      callback(`Room ${roomId} does not exist`);
      return;
    }

    // Verificar si la sala está llena
    const roomUsers = io.sockets.adapter.rooms.get(roomId);
    if (roomUsers && roomUsers.size >= room.capacity) {
      callback(`Room ${roomId} is full`);
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

  // Petición para listar salas activas
  socket.on('listRooms', (callback) => {
    const response = DB.rooms.map(e => {
      const roomUsers = io.sockets.adapter.rooms.get(e.uuid);
      return {
        ...e,
        isFull: roomUsers ? roomUsers.size >= e.capacity : false
      }
    })
    callback(response);
  });
}
