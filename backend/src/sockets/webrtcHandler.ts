import { Server, Socket } from 'socket.io';

/**
 * Tipos de payloads usados en la señalización WebRTC
 */
type JoinPayload = { roomId: string; meta?: Record<string, unknown> };
type LeavePayload = { roomId: string };
type OfferPayload = { to: string; sdp: RTCSessionDescriptionInit };
type AnswerPayload = { to: string; sdp: RTCSessionDescriptionInit };
type IcePayload = { to: string; candidate: RTCIceCandidateInit };

type Ack<T = unknown> = (resp: { ok: boolean; error?: string; data?: T }) => void;

/**
 * Devuelve los peers conectados en una sala, excluyendo opcionalmente al socket actual
 * @param io Instancia de Socket.IO server
 * @param roomId ID de la sala
 * @param excludeId Socket.id a excluir
 * @returns Lista de IDs de peers en la sala
 */
const getPeersInRoom = (io: Server, roomId: string, excludeId?: string): string[] => {
  const room = io.sockets.adapter.rooms.get(roomId);
  if (!room) return [];
  const peers = Array.from(room);
  return excludeId ? peers.filter((id) => id !== excludeId) : peers;
};

/**
 * Maneja todos los eventos relacionados con la señalización WebRTC
 * (ofertas, respuestas, ICE candidates, unión a salas de streaming, etc.)
 * @param io Instancia de Socket.IO server
 * @param socket Conexión del cliente actual
 */
export function handleWebRTCEvents(io: Server, socket: Socket) {

  /**
   * Evento: Unirse a una sala WebRTC
   * @param payload Contiene roomId y meta opcional
   * @param ack Callback de confirmación con la lista de peers ya presentes
   */
  socket.on('webrtc:join', async (payload: JoinPayload, ack?: Ack<{ peers: string[] }>) => {
    try {
      const { roomId, meta } = payload;
      await socket.join(roomId);

      console.log(`User ${socket.id} joined room ${roomId}`);

      const peers = getPeersInRoom(io, roomId, socket.id);

      // Notificar a los demás que un nuevo peer entró
      socket.to(roomId).emit('webrtc:user-joined', { id: socket.id, meta });

      ack?.({ ok: true, data: { peers } });
    } catch (err: any) {
      ack?.({ ok: false, error: err?.message || 'Failed to join room' });
    }
  });

  /**
   * Evento: Salir de una sala WebRTC
   * @param payload Contiene roomId
   */
  socket.on('webrtc:leave', async (payload: LeavePayload, ack?: Ack) => {
    try {
      const { roomId } = payload;
      await socket.leave(roomId);

      // Notificar a los demás que el peer se fue
      socket.to(roomId).emit('webrtc:user-left', { id: socket.id });

      ack?.({ ok: true });
    } catch (err: any) {
      ack?.({ ok: false, error: err?.message || 'Failed to leave room' });
    }
  });

  /**
   * Evento: Enviar una oferta SDP a otro peer
   * @param payload Contiene ID del receptor y SDP
   */
  socket.on('webrtc:offer', (payload: OfferPayload, ack?: Ack) => {
    try {
      const { to, sdp } = payload;
      io.to(to).emit('webrtc:offer', { from: socket.id, sdp });
      ack?.({ ok: true });
    } catch (err: any) {
      ack?.({ ok: false, error: err?.message || 'Failed to send offer' });
    }
  });

  /**
   * Evento: Enviar una respuesta SDP a otro peer
   * @param payload Contiene ID del receptor y SDP
   */
  socket.on('webrtc:answer', (payload: AnswerPayload, ack?: Ack) => {
    try {
      const { to, sdp } = payload;
      io.to(to).emit('webrtc:answer', { from: socket.id, sdp });
      ack?.({ ok: true });
    } catch (err: any) {
      ack?.({ ok: false, error: err?.message || 'Failed to send answer' });
    }
  });

  /**
   * Evento: Enviar un ICE candidate a otro peer
   * @param payload Contiene ID del receptor y candidate
   */
  socket.on('webrtc:ice-candidate', (payload: IcePayload, ack?: Ack) => {
    try {
      const { to, candidate } = payload;
      io.to(to).emit('webrtc:ice-candidate', { from: socket.id, candidate });
      ack?.({ ok: true });
    } catch (err: any) {
      ack?.({ ok: false, error: err?.message || 'Failed to send ICE candidate' });
    }
  });

  /**
   * Evento: Notificar inicio de screen sharing
   * @param roomId Sala donde se está compartiendo pantalla
   */
  socket.on('webrtc:screen-start', ({ roomId }: { roomId: string }) => {
    socket.to(roomId).emit('webrtc:screen-start', { id: socket.id });
  });

  /**
   * Evento: Notificar fin de screen sharing
   * @param roomId Sala donde se estaba compartiendo pantalla
   */
  socket.on('webrtc:screen-stop', ({ roomId }: { roomId: string }) => {
    socket.to(roomId).emit('webrtc:screen-stop', { id: socket.id });
  });

  /**
   * Evento: Desconexión del socket
   * Se informa a todas las salas donde estaba el usuario
   */
  socket.on('disconnect', () => {
    socket.rooms.forEach((roomId) => {
      if (roomId === socket.id) return;
      socket.to(roomId).emit('webrtc:user-left', { id: socket.id });
    });
  });
}

export default handleWebRTCEvents;
