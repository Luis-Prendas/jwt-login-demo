import { Router } from "express";
import { validateBody } from "../middlewares/validate";
import { createDepartment, deleteDepartment, getAllDepartments, getDepartment, updateDepartment } from "../controllers/department/department.controller";
import { z } from 'zod';
import { authenticateToken } from "../middlewares/authenticateToken";
import { createDepartmentSchema, updateDepartmentSchema } from "../zod-schemas";

export type UpdateDepartmentDto = z.infer<typeof updateDepartmentSchema>
export type CreateDepartmentDto = z.infer<typeof createDepartmentSchema>

const departmentRouter = Router();

departmentRouter.get("/getAll/:orgId", authenticateToken, getAllDepartments);
departmentRouter.get("/get/:id", authenticateToken, getDepartment);
departmentRouter.put("/update/:id", authenticateToken, validateBody(updateDepartmentSchema), updateDepartment);
departmentRouter.post("/create/:orgId", authenticateToken, validateBody(createDepartmentSchema), createDepartment);
departmentRouter.delete("/delete/:id", authenticateToken, deleteDepartment);

export default departmentRouter;
