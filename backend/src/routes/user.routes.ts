import { Router } from 'express';
import { getAllUsers, getUser, updateUser, userDelete } from '../controllers/user/user.controller';
import { authenticateToken } from '../middlewares/authenticateToken';

/**
 * Rutas relacionadas con la gestión de usuarios.
 * Todas requieren autenticación mediante JWT.
 */
const userRouter = Router();

/** 
 * GET /api/user/getUser/:id
 * Obtener información de un usuario específico por ID
 * Recibe: { id }
 * Retorna: TBL_User
 */
userRouter.get('/getUser/:id', authenticateToken, getUser);

/**
 * GET /api/user/getAllUsers
 * Obtener listado de todos los usuarios (admin/dev)
 * Retorna: TBL_User[]
 */
userRouter.get('/getAllUsers', authenticateToken, getAllUsers);

/**
 * PUT /api/user/updateUser/:id
 * Actualizar información del usuario
 * Recibe: { id, userData }
 * Retorna: Boolean
 */
userRouter.put('/updateUser/:id', authenticateToken, updateUser);

/**
 * DELETE /api/user/deleteUser/:id
 * Eliminar un usuario específico por ID
 * Recibe: { id }
 * Retorna: Boolean
 */
userRouter.delete('/deleteUser/:id', authenticateToken, userDelete);

export default userRouter;