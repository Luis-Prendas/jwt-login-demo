import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { initDB } from '../db/db';
import { SECRET_KEY } from '../config/env';
import { v4 as uuidv4 } from 'uuid';
import { UserBasicData } from '../types/UserManagement';
import bcrypt from 'bcrypt';
import { getLogger } from '../utils/logger';

const logger = getLogger('api-session-log');

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { username, password } = req.body;
    logger.info(`Intento de login para usuario: ${username}`);

    if (!username || !password) {
      logger.warn('Campos faltantes en login');
      return res.status(400).json({ error: 'Usuario y contraseña son obligatorios.' });
    }

    const db = await initDB();
    const user = await db.get(`SELECT * FROM users WHERE username = ?`, [username]);

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
      uuid: user.uuid,
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

export const register = async (req: Request, res: Response) => {
  const SALT_ROUNDS = 10;

  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ error: 'Nombre de usuario, email y contraseña son obligatorios.' });
    }

    const db = await initDB();

    // Verificar si el usuario ya existe
    const existingUser = await db.get(
      `SELECT * FROM users WHERE username = ? OR email = ?`,
      [username, email]
    );

    if (existingUser) {
      return res.status(409).json({ error: 'Usuario o email ya existente.' });
    }

    // Crear nuevo UUID para el usuario
    const newUuid = uuidv4();

    // Insertar nuevo usuario en la base de datos
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    await db.run(
      `INSERT INTO users (uuid, email, username, password, nickname, role, rafflePoints)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [newUuid, email, username, hashedPassword, username, 'user', 0]
    );

    // Preparar payload para JWT
    const payload: UserBasicData = {
      uuid: newUuid,
      username,
      nickname: username,
      email,
      role: 'user',
    };

    // Generar token con expiración de 1 hora
    const token = jwt.sign({ user: payload }, SECRET_KEY, { expiresIn: '1h' });

    return res.status(200).json({ token });
  } catch (error) {
    console.error('[Register Error]:', error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
};
