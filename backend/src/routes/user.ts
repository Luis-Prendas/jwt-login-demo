import { Router } from 'express';
import { getUser, addPoints, getAllUsers } from '../controllers/user.controller';
import { authenticateToken } from '../middlewares/authenticateToken';

const router = Router();

router.get('/user', authenticateToken, getUser);
router.get('/users', authenticateToken, getAllUsers);
router.post('/add-points', authenticateToken, addPoints);

export default router;
