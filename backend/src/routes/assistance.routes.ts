import { Router } from 'express';
import { authenticateToken } from '../middlewares/authenticateToken';
import { getAllUserTabsMenu } from '../controllers/tabsMenu.controller';
import { getAllUserAssistance } from '../controllers/assistance.controller';

/**
 * Rutas relacionadas con la asistencia.
 * Requiere autenticación mediante JWT.
 */
const assistanceRouter = Router();

assistanceRouter.post('/getAssistance', authenticateToken, getAllUserAssistance);

export default assistanceRouter;