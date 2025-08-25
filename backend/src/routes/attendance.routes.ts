import { Router } from 'express';
import { authenticateToken } from '../middlewares/authenticateToken';
import { getAttendance } from '../controllers/attendance/attendance.controller';

/**
 * Rutas relacionadas con la asistencia.
 * Todas requieren autenticación mediante JWT.
 */
const attendanceRouter = Router();

/**
 * GET /api/attendance/getAttendance/:userId/:date
 * Recibe: { userId, date }
 * Devuelve: TBL_Attendance
 */
attendanceRouter.get('/getAttendance/:userId/:date', authenticateToken, getAttendance);

export default attendanceRouter;