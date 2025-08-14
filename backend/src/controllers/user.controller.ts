import { Request, Response } from 'express';
import { DB } from '../db/mockDB';

export const getUser = (req: Request, res: Response) => {
  const username = req.user?.user.username;
  const user = DB.users.find(u => u.username === username);

  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

  res.json({ user });
};

export const getAllUsers = (req: Request, res: Response) => {
  res.json({ users: DB.users });
};

export const addPoints = (req: Request, res: Response) => {
  const username = req.user?.user.username;
  const user = DB.users.find(u => u.username === username);

  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

  const points = Number(req.body.points);
  if (isNaN(points) || points <= 0) return res.status(400).json({ error: 'Cantidad inválida' });

  user.balance.rafflePoints += points;
  res.json({ message: 'Puntos agregados', user });
};
