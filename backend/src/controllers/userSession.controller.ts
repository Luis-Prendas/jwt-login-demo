import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { DB } from '../db/mockDB';
import { SECRET_KEY } from '../config/env';
import { User, UserBasicData } from '../types/UserManagement';
import { initDB } from '../db/db';
import { v4 as uuidv4 } from "uuid";

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Validación básica
    if (!username || !password) {
      return res.status(400).json({ error: "Usuario y contraseña son obligatorios." });
    }

    const db = await initDB();

    // Buscar usuario en la DB
    const user = await db.get(
      `SELECT * FROM users WHERE username = ? AND password = ?`,
      [username, password]
    );

    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas." });
    }

    const payload = {
      username: user.username,
      role: user.role,
      uuid: user.uuid,
      nickname: user.nickname,
      email: user.email,
    };

    const token = jwt.sign({ user: payload }, SECRET_KEY, { expiresIn: "1h" });

    return res.status(200).json({ token });
  } catch (err) {
    console.error("Error en login:", err);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body;
    const db = await initDB();

    // ¿Usuario existente?
    const existingUser = await db.get(
      `SELECT * FROM users WHERE username = ? OR email = ?`,
      [username, email]
    );

    if (existingUser) {
      return res.status(409).json({ error: "Usuario ya existente." });
    }

    const newUuid = uuidv4();
    await db.run(
      `INSERT INTO users 
       (uuid, email, username, password, nickname, role, rafflePoints)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [newUuid, email, username, password, username, "user", 0]
    );

    const payload = {
      username,
      role: "user",
      uuid: newUuid,
      nickname: username,
      email,
    };

    const token = jwt.sign({ user: payload }, SECRET_KEY, { expiresIn: "1h" });

    res.status(200).json({ token });
  } catch (err) {
    console.error("Error en registro:", err);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};
