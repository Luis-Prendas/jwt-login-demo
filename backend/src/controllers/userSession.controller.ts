import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { initDB } from '../db/db';
import { SECRET_KEY } from '../config/env';
import { v4 as uuidv4 } from 'uuid';
import { UserBasicData } from '../types/UserManagement';
import bcrypt from 'bcrypt';

/**
 * Endpoint para iniciar sesión de usuario.
 * Valida credenciales y retorna un JWT con los datos básicos del usuario.
 */

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Validación de campos obligatorios
    if (!username || !password) {
      return res.status(400).json({ error: 'Usuario y contraseña son obligatorios.' });
    }

    const db = await initDB();

    // Buscar usuario por username
    const user = await db.get(`SELECT * FROM users WHERE username = ?`, [username]);

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    // Validar contraseña ingresada contra hash
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    // Preparar payload para el token JWT
    const payload: UserBasicData = {
      uuid: user.uuid,
      email: user.email,
      username: user.username,
      nickname: user.nickname,
      role: user.role,
    };

    // Generar token con expiración de 1 hora
    const token = jwt.sign({ user: payload }, SECRET_KEY, { expiresIn: '1h' });

    return res.status(200).json({ token });
  } catch (error) {
    console.error('[Login Error]:', error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
};


/**
 * Endpoint para registrar un nuevo usuario.
 * Valida que no exista un usuario con el mismo username o email y retorna un JWT.
 */
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
