import { Server, Socket } from 'socket.io';
import { nanoid } from 'nanoid';

const activeRooms = new Set<string>();

export function roomHandler(io: Server, socket: Socket) {
  const emitRoomsUpdate = () => {
    io.emit("roomsUpdated", Array.from(activeRooms));
  };

  // Crear sala
  socket.on('createRoom', (_, callback) => {
    const roomId = nanoid(8);
    activeRooms.add(roomId);
    socket.join(roomId);
    callback(roomId);
    console.log(`Room created: ${roomId} by ${(socket as any).user?.username}`);
    emitRoomsUpdate();
  });

  // Unirse a sala
  socket.on('joinRoom', (roomId, callback) => {
    if (!activeRooms.has(roomId)) {
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

  // Petición para listar salas activas
  socket.on('listRooms', (callback) => {
    console.log(`Active rooms: ${Array.from(activeRooms).join(", ")}`);
    callback(Array.from(activeRooms));
  });

  // Opcional: borrar sala si está vacía
  socket.on('leaveRoom', (roomId) => {
    socket.leave(roomId);

    // Comprobar si quedan usuarios
    const room = io.sockets.adapter.rooms.get(roomId);
    if (!room || room.size === 0) {
      activeRooms.delete(roomId);
      console.log(`Room deleted (leave): ${roomId}`);
      emitRoomsUpdate();
    }
  });

  // También se podría limpiar activeRooms si el usuario desconecta y deja salas vacías
  socket.on('disconnecting', () => {
    for (const roomId of socket.rooms) {
      if (roomId !== socket.id) { // sockets están en su propia sala con su id
        const room = io.sockets.adapter.rooms.get(roomId);
        if (!room || room.size === 0) {
          activeRooms.delete(roomId);
          console.log(`Room deleted (disconnect): ${roomId}`);
        }
      }
    }
    emitRoomsUpdate();
  });
}
