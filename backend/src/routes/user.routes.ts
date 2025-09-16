import { Router } from 'express';
import { createUser, getAllUsers, getUser, updateUser, userDelete } from '../controllers/user/user.controller';
import { authenticateToken } from '../middlewares/authenticateToken';
import { z } from 'zod';
import { validateBody } from '../middlewares/validate';
import { createUserSchema, updateUserSchema } from '../zod-schemas';

export type UpdateUserDto = z.infer<typeof updateUserSchema>
export type CreateUserDto = z.infer<typeof createUserSchema>

const userRouter = Router();

userRouter.get('/get/:id', authenticateToken, getUser);
userRouter.get('/getAll/:orgId', authenticateToken, getAllUsers);
userRouter.post('/create', authenticateToken, validateBody(createUserSchema), createUser);
userRouter.put('/update/:id', authenticateToken, validateBody(updateUserSchema), updateUser);
userRouter.delete('/delete/:id', authenticateToken, userDelete);

export default userRouter;