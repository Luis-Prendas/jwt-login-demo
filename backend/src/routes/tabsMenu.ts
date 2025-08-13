import { Router } from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import { getAllTabsMenu } from "../controllers/tabsMenu.controller";

const router = Router()

router.get('/tabs-menu', authenticateToken, getAllTabsMenu)

export default router;