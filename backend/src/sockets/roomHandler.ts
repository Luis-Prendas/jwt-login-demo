import { Server, Socket } from 'socket.io';
import { DB } from '../db/mockDB';
import { UserBasicData } from '../types/UserManagement';

/**
 * Maneja todos los eventos relacionados con las salas (rooms) de Socket.IO.
 * @param io Instancia de Socket.IO server
 * @param socket Conexión del cliente actual
 */
export function handleRoomEvents(io: Server, socket: Socket) {

  /**
   * Emite a todos los clientes la lista de salas actualizada,
   * indicando si cada sala está llena o no.
   */
  const broadcastRooms = () => {
    const roomsList = DB.rooms.map(room => {
      const roomUsers = io.sockets.adapter.rooms.get(room.uuid);
      return {
        ...room,
        isFull: roomUsers ? roomUsers.size >= room.capacity : false
      };
    });

    io.emit('roomsUpdated', roomsList);
  };

  /**
   * Evento: Unirse a una sala
   * @param roomId ID de la sala
   * @param callback Función de respuesta al cliente
   */
  socket.on('joinRoom', (roomId: string, callback: (msg: string) => void) => {
    const room = DB.rooms.find(r => r.uuid === roomId);

    // Verificar si la sala existe
    if (!room) {
      broadcastRooms();
      return callback(`Room ${roomId} does not exist`);
    }

    // Verificar si la sala está llena
    const roomUsers = io.sockets.adapter.rooms.get(roomId);
    if (roomUsers && roomUsers.size >= room.capacity) {
      return callback(`Room ${roomId} is full`);
    }

    // Unirse a la sala
    socket.join(roomId);

    // Obtener información del usuario autenticado
    const user: UserBasicData = (socket as any).user.user;

    // Notificar al usuario y al resto de la sala
    callback(`Joined room ${roomId}`);
    socket.to(roomId).emit('userJoined', {
      id: socket.id,
      uuid: user.uuid,
      username: user.username,
      nickname: user.nickname,
    });

    // Actualizar lista de salas global
    broadcastRooms();
  });

  /**
   * Evento: Enviar mensaje dentro de una sala
   * @param data Objeto con { roomId, message }
   */
  socket.on('chatMessage', (data: { roomId: string; message: string }) => {
    const user: UserBasicData = (socket as any).user.user;

    io.to(data.roomId).emit('chatMessage', {
      id: socket.id,
      uuid: user.uuid,
      username: user.username,
      nickname: user.nickname,
      message: data.message,
    });
  });

  /**
   * Evento: Listar salas activas
   * @param callback Función de respuesta al cliente
   */
  socket.on('listRooms', (callback: (rooms: typeof DB.rooms) => void) => {
    const roomsList = DB.rooms.map(room => {
      const roomUsers = io.sockets.adapter.rooms.get(room.uuid);
      return {
        ...room,
        isFull: roomUsers ? roomUsers.size >= room.capacity : false
      };
    });

    callback(roomsList);
  });
}
