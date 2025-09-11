import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { initDB } from '../../db/db';
import { SECRET_KEY } from '../../config/env';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { getLogger } from '../../utils/logger';
import { TBL_User, UserWithPassword } from '../../types/DataBase';
import { getUserByUsernameAndOrg } from '../../services/session/session.services';

const logger = getLogger('api-session');

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { username, password, orgCode } = req.body;
    logger.info(`Intento de login -> { ${username} | ${password} | ${orgCode} }`);

    if (!username || !password || !orgCode) {
      logger.warn(`Credenciales inválidas -> { ${username} | ${password} | ${orgCode} }`);
      return res.status(400).json({ error: 'Credenciales inválidas.' });
    }

    const db = await initDB();
    const user = await getUserByUsernameAndOrg(db, username, orgCode)

    if (!user) {
      logger.warn(`Usuario no encontrado -> { ${username} | ${password} | ${orgCode} }`);
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      logger.warn(`Contraseña inválida -> { ${password} }`);
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const payload: TBL_User = user

    const token = jwt.sign({ user: payload }, SECRET_KEY, { expiresIn: '24h' });

    logger.info(`Login exitoso -> { ${username} | ${password} | ${orgCode} }`);

    return res.status(200).json({ token });
  } catch (error) {
    logger.error(`[Login Error]: ${(error as Error).message}`);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  } finally {
    logger.info(`------------ ${req.method} ${req.originalUrl} finalizado ------------`);
    logger.info('');
  }
};

export const register = async (req: Request, res: Response): Promise<Response> => {
  const SALT_ROUNDS = 10;

  try {
    const { reqData }: { reqData: UserWithPassword } = req.body;
    logger.info(`Intento de registro -> { ${reqData} }`);

    if (!reqData) {
      logger.warn(`Credenciales inválidas -> { ${reqData} }`);
      return res.status(400).json({ error: 'Nombre de usuario, email y contraseña son obligatorios.' });
    }

    const db = await initDB();

    const existingUser = await db.get(`SELECT * FROM user WHERE username = ? OR email = ?`, [reqData.username, reqData.email]) as UserWithPassword;

    if (existingUser) {
      logger.warn(`Usuario ya existente -> { ${reqData} }`);
      return res.status(409).json({ error: 'Usuario o email ya existente.' });
    }

    const newUuid = uuidv4();
    const hashedPassword = await bcrypt.hash(reqData.password, SALT_ROUNDS);

    await db.run(
      `INSERT INTO user (id, email, username, password, nickname, name, lastName, phone, gender, birthDate, indentificationNumber, address, role, description, organizationId, createdAt, createdBy, updatedAt, updatedBy, deletedAt, deletedBy, isDeleted)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newUuid,
        reqData.email,
        reqData.username,
        hashedPassword,
        reqData.nickname,
        reqData.name,
        reqData.lastName,
        reqData.phone,
        reqData.gender,
        reqData.birthDate,
        reqData.indentificationNumber,
        reqData.address,
        reqData.role,
        reqData.description,
        reqData.organizationId,
        reqData.createdAt,
        reqData.createdBy,
        reqData.updatedAt,
        reqData.updatedBy,
        reqData.deletedAt,
        reqData.deletedBy,
        reqData.isDeleted,]
    );

    const payload: TBL_User = reqData

    const token = jwt.sign({ user: payload }, SECRET_KEY, { expiresIn: '24h' });

    logger.info(`Registro exitoso -> { ${reqData} }`);

    return res.status(200).json({ token });
  } catch (error) {
    logger.error(`[Register Error]: ${(error as Error).message}`);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  } finally {
    logger.info(`------------ ${req.method} ${req.originalUrl} finalizado ------------`);
  }
};