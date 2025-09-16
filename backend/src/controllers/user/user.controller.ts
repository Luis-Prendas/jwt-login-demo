import { Request, Response } from 'express';
import { getLogger } from '../../utils/logger';
import asyncHandler from 'express-async-handler';
import { createUserService, deleteUserService, getAllUserService, getUserService, updateUserService } from '../../services/user/user.services';
import { ApiError } from '../../utils/ApiError';
import { CreateUserDto, UpdateUserDto } from '../../routes/user.routes';

const logger = getLogger('api-user');

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`------------ ${req.method} ${req.originalUrl} Iniciado ------------`);
  const id = req.params.id;
  if (!id) {
    logger.warn('ID de usuario no proporcionado en la solicitud');
    throw new ApiError(400, 'ID de usuario no proporcionado');
  }
  const user = await getUserService(id);
  if (!user) {
    logger.warn('Usuario no encontrado');
    throw new ApiError(404, 'Usuario no encontrado');
  }
  logger.info(`Usuario encontrado: ${JSON.stringify(user)}`);
  logger.info(`------------ ${req.method} ${req.originalUrl} Finalizado ------------`);
  res.json({ user });
});

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`------------ ${req.method} ${req.originalUrl} Iniciado ------------`);
  const orgId = req.params.orgId;
  if (!orgId) {
    logger.warn('ID de organización no proporcionado');
    throw new ApiError(400, 'ID de organización no proporcionado');
  }
  const users = await getAllUserService(orgId);
  if (!users || users.length === 0) {
    logger.warn('No se encontraron usuarios');
    throw new ApiError(404, 'No se encontraron usuarios');
  }
  logger.info(`Usuarios encontrados: ${JSON.stringify(users)}`);
  logger.info(`------------ ${req.method} ${req.originalUrl} Finalizado ------------`);
  res.json({ users });
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`------------ ${req.method} ${req.originalUrl} Iniciado ------------`);
  const id = req.params.id;
  if (!id) {
    logger.warn(`ID no proporcionado\n`);
    throw new ApiError(400, 'ID no proporcionado');
  }
  const createData: CreateUserDto = req.body.content;
  const userRequest = req.body.userRequest;
  const user = await createUserService(id, createData, userRequest)
  if (!user) {
    logger.warn(`No se pudo crear el puesto -> ${id}\n`);
    throw new ApiError(400, 'No se pudo crear el puesto');
  }
  logger.info(`Puesto actualizado -> ${JSON.stringify(user)}`);
  logger.info(`------------ ${req.method} ${req.originalUrl} Finalizado ------------\n`);
  res.json({ data: user });
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`------------ ${req.method} ${req.originalUrl} Iniciado ------------`);
  const id = req.params.id;
  if (!id) {
    logger.warn(`ID no proporcionado\n`);
    throw new ApiError(400, 'ID no proporcionado');
  }
  const dataUpdate: UpdateUserDto = req.body.content;
  const userRequest = req.body.userRequest;
  const user = await updateUserService(id, dataUpdate, userRequest)
  if (!user) {
    logger.warn(`No se pudo actualizar el puesto -> ${id}\n`);
    throw new ApiError(400, 'No se pudo actualizar el puesto');
  }
  logger.info(`Puesto actualizado -> ${JSON.stringify(user)}`);
  logger.info(`------------ ${req.method} ${req.originalUrl} Finalizado ------------\n`);
  res.json({ data: user });
});

export const userDelete = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`------------ ${req.method} ${req.originalUrl} Iniciado ------------`);
  const id = req.params.id;
  if (!id) {
    logger.warn(`ID no proporcionado\n`);
    throw new ApiError(400, 'ID no proporcionado');
  }
  const userRequest = req.body.userRequest;
  const user = await deleteUserService(id, userRequest);
  if (!user) {
    logger.warn(`No se pudo eliminar el puesto -> ${id}\n`);
    throw new ApiError(400, 'No se pudo eliminar el puesto');
  }
  logger.info(`Puesto eliminado -> ${JSON.stringify(user)}`);
  logger.info(`------------ ${req.method} ${req.originalUrl} Finalizado ------------\n`);
  res.json({ data: user });
});
