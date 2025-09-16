import { getLogger } from "../../utils/logger";
import { ApiError } from "../../utils/ApiError";
import asyncHandler from 'express-async-handler';
import { Request, Response } from "express";
import { getAllPositionsService, getPositionService, createPositionService, updatePositionService, deletePositionService } from "../../services/position/position.services";
import { CreatePositionDto, UpdatePositionDto } from "../../routes/position.routes";

const logger = getLogger('api/position');

export const getAllPositions = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`------------ ${req.method} ${req.originalUrl} Iniciado ------------`);
  const deptId = req.params.deptId;
  if (!deptId) {
    logger.warn(`ID no proporcionado\n`);
    throw new ApiError(400, 'ID no proporcionado');
  }
  const positions = await getAllPositionsService(deptId);
  if (!positions || positions.length === 0) {
    logger.warn(`No se encontraron puestos -> ${deptId}\n`);
    throw new ApiError(400, 'No se encontraron puestos');
  }
  logger.info(`Puestos encontrados -> ${JSON.stringify(positions)}`);
  logger.info(`------------ ${req.method} ${req.originalUrl} Finalizado ------------\n`);
  res.json({ data: positions });
});

export const getPosition = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`------------ ${req.method} ${req.originalUrl} Iniciado ------------`);
  const id = req.params.id;
  if (!id) {
    logger.warn(`ID no proporcionado\n`);
    throw new ApiError(400, 'ID no proporcionado');
  }
  const position = await getPositionService(id);
  if (!position) {
    logger.warn(`No se encontro el puesto -> ${id}\n`);
    throw new ApiError(400, 'No se encontro el puesto');
  }
  logger.info(`Puesto encontrado -> ${JSON.stringify(position)}`);
  logger.info(`------------ ${req.method} ${req.originalUrl} Finalizado ------------\n`);
  res.json({ data: position });
});

export const createPosition = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`------------ ${req.method} ${req.originalUrl} Iniciado ------------`);
  const deptId = req.params.deptId;
  if (!deptId) {
    logger.warn(`ID no proporcionado\n`);
    throw new ApiError(400, 'ID no proporcionado');
  }
  const createData: CreatePositionDto = req.body.content;
  const userRequest = req.body.userRequest;
  if (!createData?.maleName || !createData?.femaleName) {
    logger.warn(`Datos no proporcionados\n`);
    throw new ApiError(400, 'Datos no proporcionados');
  }
  const position = await createPositionService(deptId, createData, userRequest);
  if (!position) {
    logger.warn(`No se pudo crear el puesto -> ${deptId}\n`);
    throw new ApiError(400, 'No se pudo crear el puesto');
  }
});

export const updatePosition = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`------------ ${req.method} ${req.originalUrl} Iniciado ------------`);

  const id = req.params.id;
  if (!id) {
    logger.warn(`ID no proporcionado\n`);
    throw new ApiError(400, 'ID no proporcionado');
  }

  const dataUpdate: UpdatePositionDto = req.body.content;
  const userRequest = req.body.userRequest;
  const position = await updatePositionService(id, dataUpdate, userRequest);
  if (!position) {
    logger.warn(`No se pudo actualizar el puesto -> ${id}\n`);
    throw new ApiError(400, 'No se pudo actualizar el puesto');
  }
  logger.info(`Puesto actualizado -> ${JSON.stringify(position)}`);
  logger.info(`------------ ${req.method} ${req.originalUrl} Finalizado ------------\n`);
  res.json({ data: position });
});

export const deletePosition = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`------------ ${req.method} ${req.originalUrl} Iniciado ------------`);
  const id = req.params.id;
  if (!id) {
    logger.warn(`ID no proporcionado\n`);
    throw new ApiError(400, 'ID no proporcionado');
  }
  const userRequest = req.body.userRequest;
  const position = await deletePositionService(id, userRequest);
  if (!position) {
    logger.warn(`No se pudo eliminar el puesto -> ${id}\n`);
    throw new ApiError(400, 'No se pudo eliminar el puesto');
  }
  logger.info(`Puesto eliminado -> ${JSON.stringify(position)}`);
  logger.info(`------------ ${req.method} ${req.originalUrl} Finalizado ------------\n`);
  res.json({ data: position });
});