import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config/env';
import { JwtUserPayload } from '../types/jwt';
import { getLogger } from '../utils/logger';

const logger = getLogger('Middleware/authenticateToken');

/**
 * Middleware para validar JWT en headers Authorization
 */
export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const content = req.body;
  const token = authHeader?.split(' ')[1];

  logger.info(`Autenticando token -> ${token}`);

  try {
    if (!token) {
      logger.warn('Token no proporcionado');
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const decoded = jwt.verify(token, SECRET_KEY) as JwtUserPayload;
    logger.info(`Token verificado -> ${token}`);

    const body = { userRequest: decoded.user, content };
    req.body = body;

    // Solo loggear "finalizado" si todo salió bien
    logger.info(`------------ ${req.method} ${req.originalUrl} finalizado ------------`);
    logger.info('');
    next();

  } catch {
    logger.error('Error al verificar el token');
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

