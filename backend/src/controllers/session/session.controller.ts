import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../../config/env';
import bcrypt from 'bcrypt';
import { getLogger } from '../../utils/logger';
import asyncHandler from 'express-async-handler';
import { getUserByUsernameAndOrg, registerUserService } from '../../services/session/session.services';
import { ApiError } from '../../utils/ApiError';
import { PayloadJWT } from '../../types/jwt';
import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { getUserByIdService, getUserByUsernameService } from '../../services/user/user.services';

const logger = getLogger('api/login');

export const login = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`------------ ${req.method} ${req.originalUrl} Iniciado ------------`);
  const { username, password, orgCode } = req.body;
  if (!username || !password || !orgCode) {
    logger.warn(`Credenciales inválidas -> { ${username} | ${password} | ${orgCode} } \n`);
    throw new ApiError(404, 'Credenciales inválidas.');
  }

  const user = await getUserByUsernameAndOrg(username, orgCode)
  if (!user) {
    logger.warn(`Usuario no encontrado -> { ${username} | ${password} | ${orgCode} } \n`);
    throw new ApiError(404, 'Credenciales inválidas.');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    logger.warn(`Contraseña inválida -> { ${password} }\n`);
    throw new ApiError(404, 'Credenciales inválidas.');
  }

  const payload: PayloadJWT = {
    id: user.id,
    email: user.email,
    username: user.username,
    nickname: user.nickname,
    name: user.name,
    lastName: user.lastName,
    phone: user.phone,
    gender: user.gender,
    birthDate: user.birthDate,
    indentificationNumber: user.indentificationNumber,
    address: user.address,
    role: user.role,
    organizationId: user.organizationId,
    description: user.description,
    isDeleted: user.isDeleted,
  }

  const token = jwt.sign({ user: payload }, SECRET_KEY, { expiresIn: '24h' });

  logger.info(`Login exitoso -> { ${username} | ${password} | ${orgCode} }`);
  logger.info(`------------ ${req.method} ${req.originalUrl} finalizado ------------\n`);

  res.json({ token })
});

export const register = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`------------ ${req.method} ${req.originalUrl} Iniciado ------------`);
  const registerData: Prisma.UserCreateInput = req.body.registerData;
  if (!registerData) {
    logger.warn(`Credenciales inválidas -> ${JSON.stringify(registerData)}\n`);
    throw new ApiError(404, 'Credenciales inválidas.');
  }

  const existingUser = await getUserByUsernameService(registerData.username)
  if (existingUser) {
    logger.warn(`Usuario ya existente -> ${JSON.stringify(existingUser)}\n`);
    throw new ApiError(404, 'Usuario ya existente');
  }

  const newUuid = uuidv4();
  await registerUserService(registerData, newUuid)
  const user = await getUserByIdService(newUuid)
  if (!user) {
    logger.warn(`Usuario no creado -> ${JSON.stringify(registerData)}\n`);
    throw new ApiError(404, 'Usuario no creado');
  }

  const payload: PayloadJWT = {
    id: user.id,
    email: user.email,
    username: user.username,
    nickname: user.nickname,
    name: user.name,
    lastName: user.lastName,
    phone: user.phone,
    gender: user.gender,
    birthDate: user.birthDate,
    indentificationNumber: user.indentificationNumber,
    address: user.address,
    role: user.role,
    organizationId: user.organizationId,
    description: user.description,
    isDeleted: user.isDeleted,
  }

  const token = jwt.sign({ user: payload }, SECRET_KEY, { expiresIn: '24h' });

  logger.info(`Registro exitoso -> ${JSON.stringify(user)}`);
  logger.info(`------------ ${req.method} ${req.originalUrl} Finalizado ------------\n`);

  res.json({ token })
});