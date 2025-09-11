import { Router } from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import { createOrganization, deleteOrganization, getAllOrg, getOrg, updateOrganization } from "../controllers/organization/organization.controller";

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

/** 
 * GET /api/organization/getOrg/:id
 * Obtener información de una organizacion específica por ID
 * Recibe: { id }
 * Retorna: TBL_Organization
 */
organizationRouter.get('/getOrg/:id', authenticateToken, getOrg)

/**
 * PUT /api/organization/update/:id
 * Actualizar información de organizacion
 * Recibe: { id, dataUpdate }
 * Retorna: Boolean
 */
organizationRouter.put('/update/:id', authenticateToken, updateOrganization);

/**
 * POST /api/organization/create
 * Endpoint para registrar una nueva organizacion.
 * Recibe: { createData }
 * Retorna: Boolean
 */
organizationRouter.post('/create', authenticateToken, createOrganization);

/**
 * DELETE /api/organization/delete/:id
 * Eliminar una organizacion específica por ID
 * Recibe: { id }
 * Retorna: Boolean
 */
organizationRouter.delete('/delete/:id', authenticateToken, deleteOrganization);

export default organizationRouter