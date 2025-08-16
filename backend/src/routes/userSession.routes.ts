import { Router } from 'express';
import { login, register } from '../controllers/userSession.controller';

/**
 * Rutas relacionadas con sesiones de usuario (login y registro)
 */
const userSessionRouter = Router();

/**
 * POST /api/sessions/login
 * Endpoint para iniciar sesión de usuario.
 * Recibe: { username, password }
 * Retorna: JWT con los datos básicos del usuario
 */
userSessionRouter.post('/login', login);

/**
 * POST /api/sessions/register
 * Endpoint para registrar un nuevo usuario.
 * Recibe: { username, email, password }
 * Retorna: JWT con los datos básicos del usuario
 */
userSessionRouter.post('/register', register);

export default userSessionRouter;
