import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config/env';
import { JwtUserPayload } from '../types/jwt';

/**
 * Middleware para validar JWT en headers Authorization
 */
export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token faltante' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as JwtUserPayload;
    req.user = decoded; // agregamos user al request
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}
