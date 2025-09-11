import { Router } from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import { getAllOrg } from "../controllers/organization/organization.controller";

/**
 * Rutas relacionadas con las organozaciones
 */
const organizationRouter = Router()

/**
 * GET /api/organization/getAllOrg
 * Obtener listado de todas las organizaciones.
 * Retorna: TBL_Organization[]
 */
organizationRouter.get('/getAllOrg', authenticateToken, getAllOrg)

export default organizationRouter