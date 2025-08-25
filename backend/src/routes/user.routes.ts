import { Router } from 'express';
import { getUser, addPoints, getAllUsers, getUserWithBadges, userUpdate, getUserWithBadgesScheduleAttendance } from '../controllers/user.controller';
import { authenticateToken } from '../middlewares/authenticateToken';

/**
 * Rutas relacionadas con la gestión de usuarios.
 * Todas requieren autenticación mediante JWT.
 */
const userRouter = Router();

// Obtener información del usuario autenticado
// userRouter.get('/user', authenticateToken, getUser);

// Obtener información de un usuario específico por UUID
userRouter.get('/user/:uuid', authenticateToken, getUserWithBadges);

// Obtener listado de todos los usuarios (admin/dev)
userRouter.get('/users', authenticateToken, getAllUsers);

// Agregar puntos al usuario autenticado
userRouter.post('/add-points', authenticateToken, addPoints);

// Actualizar información del usuario
userRouter.put('/user/:uuid', authenticateToken, userUpdate);

userRouter.get('/user/withBadgesScheduleAttendance/:uuid', authenticateToken, getUserWithBadgesScheduleAttendance);

export default userRouter;