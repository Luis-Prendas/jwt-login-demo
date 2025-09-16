import { Router } from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import { z } from 'zod';
import { validateBody } from "../middlewares/validate";
import { getAllPositions, getPosition, createPosition, updatePosition, deletePosition } from "../controllers/position/position.controller";

const positionRouter = Router();

export const createPositionSchema = z.object({
  maleName: z.string().min(1),
  femaleName: z.string().min(1),
  description: z.string().optional(),
})

export const updatePositionSchema = z.object({
  maleName: z.string().min(1),
  femaleName: z.string().min(1),
  description: z.string().optional(),
})

positionRouter.get("/getAll/:deptId", authenticateToken, getAllPositions);
positionRouter.get("/get/:id", authenticateToken, getPosition);
positionRouter.post("/create/:deptId", authenticateToken, validateBody(createPositionSchema), createPosition);
positionRouter.put("/update/:id", authenticateToken, validateBody(updatePositionSchema), updatePosition);
positionRouter.delete("/delete/:id", authenticateToken, deletePosition);

export default positionRouter;