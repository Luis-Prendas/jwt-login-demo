import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config/env';
import { JwtUserPayload, PayloadJWT } from '../types/jwt';
import { getLogger } from '../utils/logger';

const logger = getLogger('Middleware/authenticateToken');

declare module 'express' {
  export interface Request {
    user?: PayloadJWT;
  }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  logger.info(`[AUTH] ${req.method} ${req.originalUrl} Iniciado`);
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    logger.warn('Token no proporcionado');
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as JwtUserPayload;
    logger.info(`[AUTH] Token verificado para usuario: ${decoded.user.username}`);
    req.user = decoded.user;
    next();
  } catch (err) {
    logger.error(`[AUTH ERROR] ${err}`);
    return res.status(401).json({ error: 'Token inválido o expirado' });
  } finally {
    logger.info(`[AUTH] ${req.method} ${req.originalUrl} Finalizado\n`);
  }
}

