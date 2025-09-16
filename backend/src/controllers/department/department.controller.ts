import { Request, Response } from "express";
import { getLogger } from "../../utils/logger";
import asyncHandler from 'express-async-handler';
import { createDepartmentService, deleteDepartmentService, getAllDepartmentsService, getDepartmentService, updateDepartmentService } from "../../services/department/department.services";
import { TBL_Department, TBL_User } from "../../types/DataBase";
import { ApiError } from "../../utils/ApiError";

const logger = getLogger("api/department");

// GET ALL
export const getAllDepartments = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`------------ ${req.method} ${req.originalUrl} Iniciado ------------`);
  const orgId = req.params.orgId;
  if (!orgId) {
    logger.warn(`ID no proporcionado\n`);
    throw new ApiError(400, 'ID no proporcionado');
  }

  const departments = await getAllDepartmentsService(orgId);
  if (!departments || departments.length === 0) {
    logger.warn(`No se encontraron departamentos -> ${orgId}\n`);
    throw new ApiError(400, 'No se encontraron departamentos');
  }

  logger.info(`Departamentos encontrados -> ${JSON.stringify(departments)}`);
  logger.info(`------------ ${req.method} ${req.originalUrl} Finalizado ------------\n`);
  res.json({ data: departments });
});

// GET ONE
export const getDepartment = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`------------ ${req.method} ${req.originalUrl} Iniciado ------------`);
  const id = req.params.id;
  if (!id) {
    logger.warn(`ID no proporcionado\n`);
    throw new ApiError(400, 'ID no proporcionado');
  }

  const department = await getDepartmentService(id);
  if (!department) {
    logger.warn(`No se encontro el departamento -> ${id}\n`);
    throw new ApiError(400, 'No se encontro el departamento');
  }

  logger.info(`Departamento encontrado -> ${JSON.stringify(department)}`);
  logger.info(`------------ ${req.method} ${req.originalUrl} Finalizado ------------\n`);
  res.json({ data: department });
});

// CREATE
export const createDepartment = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`------------ ${req.method} ${req.originalUrl} Iniciado ------------`);
  const orgId = req.params.orgId;
  if (!orgId) {
    logger.warn(`ID no proporcionado\n`);
    throw new ApiError(400, 'ID no proporcionado');
  }
  const createData: Pick<TBL_Department, "name" | "description"> = req.body.content;
  const userRequest: TBL_User = req.body.userRequest;
  if (!createData?.name) {
    logger.warn(`Datos no proporcionados\n`);
    throw new ApiError(400, 'Datos no proporcionados');
  }
  const department = await createDepartmentService(orgId, createData, userRequest);
  if (!department) {
    logger.warn(`No se pudo crear el departamento -> ${orgId}\n`);
    throw new ApiError(400, 'No se pudo crear el departamento');
  }
  logger.info(`Departamento creado con éxito -> ${JSON.stringify(department)}`);
  logger.info(`------------ ${req.method} ${req.originalUrl} Finalizado ------------\n`);
  res.json({ data: department });
});

// UPDATE
export const updateDepartment = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`------------ ${req.method} ${req.originalUrl} Iniciado ------------`);
  const id = req.params.id;
  if (!id) {
    logger.warn(`ID no proporcionado\n`);
    throw new ApiError(400, 'ID no proporcionado');
  }
  const dataUpdate: Pick<TBL_Department, "name" | "description"> = req.body.content;
  const userRequest: TBL_User = req.body.userRequest;
  if (!dataUpdate?.name) {
    logger.warn(`Datos no proporcionados\n`);
    throw new ApiError(400, 'Datos no proporcionados');
  }
  const department = await updateDepartmentService(id, dataUpdate, userRequest);
  if (!department) {
    logger.warn(`No se pudo actualizar el departamento -> { ${id} }\n`);
    throw new ApiError(400, 'No se pudo actualizar el departamento');
  }
  logger.info(`Departamento actualizado con éxito -> { ${id} }`);
  logger.info(`------------ ${req.method} ${req.originalUrl} Finalizado ------------\n`);
  res.json({ data: department });
});

// DELETE
export const deleteDepartment = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`------------ ${req.method} ${req.originalUrl} Iniciado ------------`);
  const id = req.params.id;
  if (!id) {
    logger.warn(`ID no proporcionado\n`);
    throw new ApiError(400, 'ID no proporcionado');
  }
  const userRequest: TBL_User = req.body.userRequest;
  const department = await deleteDepartmentService(id, userRequest);
  if (department.count === 0) {
    logger.warn(`No se pudo eliminar el departamento -> { ${id} }\n`);
    throw new ApiError(400, 'No se pudo eliminar el departamento');
  }
  logger.info(`Departamento eliminado con éxito -> { ${id} }`);
  logger.info(`------------ ${req.method} ${req.originalUrl} Finalizado ------------\n`);
  res.json({ data: department });
});
