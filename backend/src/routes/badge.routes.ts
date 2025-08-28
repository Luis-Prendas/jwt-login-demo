import { Router } from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import { getUserBadges } from "../controllers/badge/badge.controller";

/**
 * Rutas relacionadas con la gestión de insignias (badges).
 * Todas requieren autenticación mediante JWT.
 */
const badgeRouter = Router();

/**
 * GET /api/badge/getUserBadges/:id
 * Obtener todas las insignias de un usuario específico por ID
 * Recibe: { id }
 * Retorna: TBL_Badge[]
 */
badgeRouter.get('/getUserBadges/:id', authenticateToken, getUserBadges);

/**
 * POST /api/badge/createBadge
 * Crear una nueva insignia
 * Recibe: { label, description }
 * Retorna: TBL_Badge
 */
// badgeRouter.post('/createBadge', authenticateToken, createBadge);

/**
 * DELETE /api/badge/deleteBadge/:id
 * Eliminar una insignia específica por ID
 * Recibe: { id }
 * Retorna: Boolean
 */
// badgeRouter.delete('/deleteBadge/:id', authenticateToken, deleteBadge);

export default badgeRouter;