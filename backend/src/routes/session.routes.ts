import { Router } from 'express';
import { login, register } from '../controllers/session/session.controller';

/**
 * Rutas relacionadas con sesiones de usuario (login y registro)
 */
const sessionRouter = Router();

/**
 * POST /api/sessions/login
 * Endpoint para iniciar sesión de usuario.
 * Recibe: { username, password }
 * Retorna: JWT con los datos básicos del usuario
 */
sessionRouter.post('/login', login);

/**
 * POST /api/sessions/register
 * Endpoint para registrar un nuevo usuario.
 * Recibe: { username, email, password }
 * Retorna: JWT con los datos básicos del usuario
 */
sessionRouter.post('/register', register);

export default sessionRouter;
