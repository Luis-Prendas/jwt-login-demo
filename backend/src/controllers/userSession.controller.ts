import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { DB } from '../db/mockDB';
import { SECRET_KEY } from '../config/env';
import { User, UserBasicData } from '../types/UserManagement';

export const login = (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = DB.users.find(u => u.username === username && u.password === password);

  if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

  const payload: UserBasicData = {
    username: user.username,
    role: user.role,
    uuid: user.uuid,
    nickname: user.nickname,
    mail: user.mail
  };

  const token = jwt.sign({user: payload}, SECRET_KEY, { expiresIn: '1h' });

  res.json({ token });
};

export const register = (req: Request, res: Response) => {
  const { username, password, mail } = req.body;

  // Check if user already exists
  const existingUser = DB.users.find(u => u.username === username || u.mail === mail);
  if (existingUser) return res.status(409).json({ error: 'Usuario ya existe' });

  // Create new user
  const newUser: User = {
    uuid: String(DB.users.length + 1),
    username,
    password,
    mail,
    nickname: username,
    role: 'user',
    balance: { rafflePoints: 0 }
  };
  DB.users.push(newUser);

  res.status(201).json({ message: 'Usuario registrado exitosamente' });
};
