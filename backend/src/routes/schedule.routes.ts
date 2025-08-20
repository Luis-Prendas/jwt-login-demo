import { Router } from 'express';
import { authenticateToken } from '../middlewares/authenticateToken';
import { getAllUserSchedule } from '../controllers/schedule.controller';

/**
 * Rutas relacionadas con los horarios.
 * Requiere autenticación mediante JWT.
 */
const scheduleRouter = Router();

scheduleRouter.post('/getSchedule', authenticateToken, getAllUserSchedule);

export default scheduleRouter;