import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config/env';
import { JwtUserPayload } from '../types/jwt';

export function socketAuth(socket: Socket, next: (err?: Error) => void) {
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error('Token requerido'));
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as JwtUserPayload;
    (socket as any).user = decoded; // Guardamos datos del usuario en el socket
    next();
  } catch {
    return next(new Error('Token inválido o expirado'));
  }
}
