import { Router } from 'express';
import { login } from '../controllers/session/session.controller';

const sessionRouter = Router();

sessionRouter.post('/login', login);

export default sessionRouter;
