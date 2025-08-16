import { Router } from 'express';
import { authenticateToken } from '../middlewares/authenticateToken';
import { getAllTabsMenu, getAllUserTabsMenu } from '../controllers/tabsMenu.controller';

/**
 * Rutas relacionadas con la configuración de tabs del menú.
 * Requiere autenticación mediante JWT.
 */
const tabsMenuRouter = Router();

/**
 * GET /api/tabs-menu
 * Retorna las opciones de menú filtradas según el rol del usuario autenticado
 */
tabsMenuRouter.get('/tabs-menu', authenticateToken, getAllUserTabsMenu);

/**
 * GET /api/tabs-menu/all
 * Retorna todas las opciones de menú (sin filtrado por rol)
 */
tabsMenuRouter.get('/tabs-menu/all', authenticateToken, getAllTabsMenu);

export default tabsMenuRouter;
