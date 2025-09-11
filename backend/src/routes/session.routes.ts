import { Router } from 'express';
import { login, register } from '../controllers/session/session.controller';

/**
 * Rutas relacionadas con sesiones de usuario (login y registro)
 */
const sessionRouter = Router();

/**
 * POST /api/session/login
 * Endpoint para iniciar sesión de usuario.
 * Recibe: { username, password, orgCode }
 * Retorna: JWT con los datos básicos del usuario
 */
sessionRouter.post('/login', login);

/**
 * POST /api/session/register
 * Endpoint para registrar un nuevo usuario.
 * Recibe: { Type UserWithPassword }
 * Retorna: JWT con los datos básicos del usuario
 */
sessionRouter.post('/register', register);

export default sessionRouter;
