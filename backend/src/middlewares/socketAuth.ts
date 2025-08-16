import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config/env';
import { JwtUserPayload } from '../types/jwt';

/**
 * Middleware de autenticación para Socket.IO.
 * Valida el JWT enviado en handshake.auth.token y lo agrega al socket.
 */
export function socketAuth(socket: Socket, next: (err?: Error) => void) {
  const token = socket.handshake.auth?.token as string | undefined;

  if (!token) {
    return next(new Error('Token requerido'));
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as JwtUserPayload;
    (socket as any).user = decoded; // Guardamos datos del usuario autenticado en el socket
    next();
  } catch (err) {
    console.error('[SocketAuth Error]:', err);
    return next(new Error('Token inválido o expirado'));
  }
}
