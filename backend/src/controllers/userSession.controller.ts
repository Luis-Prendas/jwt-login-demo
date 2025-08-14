import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { DB } from '../db/mockDB';
import { SECRET_KEY } from '../config/env';
import { User, UserBasicData } from '../types/UserManagement';

export const login = (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Validación básica
    if (!username || !password) {
      return res.status(400).json({ error: "Usuario y contraseña son obligatorios." });
    }

    const user = DB.users.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas." });
    }

    const payload: UserBasicData = {
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

export const register = (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body;
    const existingUser = DB.users.find(u => u.username === username || u.email === email);

    if (existingUser) {
      return res.status(409).json({ error: 'Usuario ya existente.' });
    }

    const newUser: User = {
      uuid: String(DB.users.length + 1),
      username,
      password,
      email,
      nickname: username,
      role: 'user',
      balance: { rafflePoints: 0 }
    };
    DB.users.push(newUser);

    const payload: UserBasicData = {
      username: newUser.username,
      role: newUser.role,
      uuid: newUser.uuid,
      nickname: newUser.nickname,
      email: newUser.email,
    };

    const token = jwt.sign({ user: payload }, SECRET_KEY, { expiresIn: "1h" });

    return res.status(200).json({ token });
  } catch (err) {
    console.error("Error en login:", err);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
};
