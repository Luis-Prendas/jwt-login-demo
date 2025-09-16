import { Router } from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import { createDepartment, deleteDepartment, getAllDepartments, getDepartment, updateDepartment } from "../controllers/department/department.controller";
import { z } from 'zod';
import { validateBody } from "../middlewares/validate";

const departmentRouter = Router();

export const createDepartmentSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export const updateDepartmentSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

departmentRouter.get("/getAll/:orgId", authenticateToken, getAllDepartments);
departmentRouter.get("/get/:id", authenticateToken, getDepartment);
departmentRouter.put("/update/:id", authenticateToken, validateBody(updateDepartmentSchema), updateDepartment);
departmentRouter.post("/create/:orgId", authenticateToken, validateBody(createDepartmentSchema), createDepartment);
departmentRouter.delete("/delete/:id", authenticateToken, deleteDepartment);

export default departmentRouter;
