import { Router } from 'express';
import { getUser, addPoints, getAllUsers, getUserWithBadges, userUpdate, getUserWithBadgesScheduleAttendance } from '../controllers/user.controller';
import { authenticateToken } from '../middlewares/authenticateToken';

/**
 * Rutas relacionadas con la gestión de usuarios.
 * Todas requieren autenticación mediante JWT.
 */
const userRouter = Router();

/** 
 * GET /api/user/getUser/:uuid
 * Obtener información de un usuario específico por UUID
 * Recibe: { uuid }
 * Retorna: TBL_User
 */
userRouter.get('/getUser/:uuid', authenticateToken, getUserWithBadges);

/**
 * GET /api/user/getAll
 * Obtener listado de todos los usuarios (admin/dev)
 * Retorna: TBL_User[]
 */
userRouter.get('/getAll', authenticateToken, getAllUsers);

/**
 * PUT /api/user/updateUser/:uuid
 * Actualizar información del usuario
 * Recibe: { uuid, userData }
 * Retorna: Boolean
 */
userRouter.put('/updateUser/:uuid', authenticateToken, userUpdate);

export default userRouter;