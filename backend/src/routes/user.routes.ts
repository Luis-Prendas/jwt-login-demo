import { Router } from 'express';
import { getAllUsers, getUser, updateUser, userDelete } from '../controllers/user/user.controller';
import { authenticateToken } from '../middlewares/authenticateToken';
import { z } from 'zod';
import { validateBody } from '../middlewares/validate';

const userRouter = Router();

export const createUserSchema = z.object({
  email: z.string().email(),
  username: z.string().min(1),
  password: z.string().min(1),
  nickname: z.string().min(1),
  name: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  gender: z.string().min(1),
  birthDate: z.string().optional(),
  indentificationNumber: z.string().optional(),
  address: z.string().optional(),
  role: z.string().min(1),
  organizationId: z.string().min(1),
  description: z.string().optional(),
})

export const updateUserSchema = z.object({
  email: z.string().email(),
  username: z.string().min(1),
  password: z.string().min(1),
  nickname: z.string().min(1),
  name: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  gender: z.string().min(1),
  birthDate: z.string().optional(),
  indentificationNumber: z.string().optional(),
  address: z.string().optional(),
  role: z.string().min(1),
  description: z.string().optional(),
})


userRouter.get('/get/:id', authenticateToken, getUser);
userRouter.get('/getAll/:orgId', authenticateToken, getAllUsers);
userRouter.post('/create', authenticateToken, validateBody(createUserSchema), createUser);
userRouter.put('/update/:id', authenticateToken, validateBody(updateUserSchema), updateUser);
userRouter.delete('/delete/:id', authenticateToken, userDelete);

export default userRouter;