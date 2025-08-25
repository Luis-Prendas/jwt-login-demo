import { Router } from 'express';
import { authenticateToken } from '../middlewares/authenticateToken';
import { getSchedule } from '../controllers/schedule/schedule.controller';

/**
 * Rutas relacionadas con los horarios.
 * Todas requieren autenticación mediante JWT.
 */
const scheduleRouter = Router();

/**
 * GET /api/schedule/getSchedule/:id
 * Recibe: { id } -> id del usuario
 * Retorna: TBL_Schedule
 */
scheduleRouter.get('/getSchedule/:id', authenticateToken, getSchedule);

export default scheduleRouter;