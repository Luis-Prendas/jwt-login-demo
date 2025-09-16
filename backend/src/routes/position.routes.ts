import { Router } from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import { z } from 'zod';
import { validateBody } from "../middlewares/validate";
import { getAllPositions, getPosition, createPosition, updatePosition, deletePosition } from "../controllers/position/position.controller";
import { createPositionSchema, updatePositionSchema } from "../zod-schemas";

export type UpdatePositionDto = z.infer<typeof updatePositionSchema>
export type CreatePositionDto = z.infer<typeof createPositionSchema>

const positionRouter = Router();

positionRouter.get("/getAll/:deptId", authenticateToken, getAllPositions);
positionRouter.get("/get/:id", authenticateToken, getPosition);
positionRouter.post("/create/:deptId", authenticateToken, validateBody(createPositionSchema), createPosition);
positionRouter.put("/update/:id", authenticateToken, validateBody(updatePositionSchema), updatePosition);
positionRouter.delete("/delete/:id", authenticateToken, deletePosition);

export default positionRouter;