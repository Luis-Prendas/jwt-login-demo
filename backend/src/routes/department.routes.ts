import { Router } from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import { createDepartment, deleteDepartment, getAllDepartments, getDepartment, updateDepartment } from "../controllers/department/department.controller";

/**
 * Rutas relacionadas con los departamentos
 */
const departmentRouter = Router();

/**
 * GET /api/department/getAll/:orgId
 * Obtener listado de todos los departamentos de una organización.
 * Recibe: { orgId }
 * Retorna: TBL_Department[]
 */
departmentRouter.get(
  "/getAll/:orgId",
  authenticateToken,
  getAllDepartments
);

/**
 * GET /api/department/get/:id
 * Obtener información de un departamento específico por ID
 * Recibe: { id }
 * Retorna: TBL_Department
 */
departmentRouter.get(
  "/get/:id",
  authenticateToken,
  getDepartment
);

/**
 * PUT /api/department/update/:id
 * Actualizar información de un departamento
 * Recibe: { id, dataUpdate }
 * Retorna: Boolean
 */
departmentRouter.put(
  "/update/:id",
  authenticateToken,
  updateDepartment
);

/**
 * POST /api/department/create/:orgId
 * Endpoint para registrar un nuevo departamento en una organización.
 * Recibe: { orgId, createData }
 * Retorna: String (UUID del nuevo departamento)
 */
departmentRouter.post(
  "/create/:orgId",
  authenticateToken,
  createDepartment
);

/**
 * DELETE /api/department/delete/:id
 * Eliminar un departamento específico por ID (soft delete)
 * Recibe: { id }
 * Retorna: Boolean
 */
departmentRouter.delete(
  "/delete/:id",
  authenticateToken,
  deleteDepartment
);

export default departmentRouter;
