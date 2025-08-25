import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { initDB } from '../../db/db';
import { SECRET_KEY } from '../../config/env';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { getLogger } from '../../utils/logger';
import { UserBasicData } from './session';
import { UserWithPassword } from '../../types/DataBase';

const logger = getLogger('api-session');

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { username, password } = req.body;
    logger.info(`Intento de login para usuario: ${username}`);

    if (!username || !password) {
      logger.warn('Campos faltantes en login');
      return res.status(400).json({ error: 'Usuario y contraseña son obligatorios.' });
    }

    const db = await initDB();
    const user = await db.get(`SELECT * FROM user WHERE username = ? AND isDeleted = 0`, [username]) as UserWithPassword

    if (!user) {
      logger.warn(`Usuario no encontrado: ${username}`);
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      logger.warn(`Contraseña inválida para usuario: ${username}`);
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const payload: UserBasicData = {
      id: user.id,
      email: user.email,
      username: user.username,
      nickname: user.nickname,
      role: user.role,
    };

    const token = jwt.sign({ user: payload }, SECRET_KEY, { expiresIn: '1h' });

    logger.info(`Login exitoso para usuario: ${username}`);

    return res.status(200).json({ token });
  } catch (error) {
    logger.error(`[Login Error]: ${(error as Error).message}`);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  } finally {
    logger.info(`------------ ${req.method} ${req.originalUrl} finalizado ------------`);
  }
};

export const register = async (req: Request, res: Response): Promise<Response> => {
  const SALT_ROUNDS = 10;

  try {
    const { username, password, email } = req.body;
    logger.info(`Intento de registro: username=${username}, email=${email}`);

    if (!username || !password || !email) {
      logger.warn('Campos faltantes en registro');
      return res.status(400).json({ error: 'Nombre de usuario, email y contraseña son obligatorios.' });
    }

    const db = await initDB();

    const existingUser = await db.get(`SELECT * FROM user WHERE username = ? OR email = ?`, [username, email]) as UserWithPassword;

    if (existingUser) {
      logger.warn(`Registro rechazado: usuario/email ya existente -> ${username}, ${email}`);
      return res.status(409).json({ error: 'Usuario o email ya existente.' });
    }

    const newUuid = uuidv4();
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    await db.run(
      `INSERT INTO user (id, email, username, password, nickname, role, description, createdAt, updatedAt, isDeleted)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [newUuid, email, username, hashedPassword, username, 'user', null, new Date().toISOString(), new Date().toISOString(), 0]
    );

    const payload: UserBasicData = {
      id: newUuid,
      username,
      nickname: username,
      email,
      role: 'user',
    };

    const token = jwt.sign({ user: payload }, SECRET_KEY, { expiresIn: '1h' });

    logger.info(`Registro exitoso para usuario: ${username}`);

    return res.status(200).json({ token });
  } catch (error) {
    logger.error(`[Register Error]: ${(error as Error).message}`);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  } finally {
    logger.info(`------------ ${req.method} ${req.originalUrl} finalizado ------------`);
  }
};