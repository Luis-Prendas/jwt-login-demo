import { Router } from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import { getAllTabsMenu, getAllUserTabsMenu } from "../controllers/tabsMenu.controller";

const router = Router()

router.get('/tabs-menu', authenticateToken, getAllUserTabsMenu)
router.get('/tabs-menu/all', authenticateToken, getAllTabsMenu);

export default router;