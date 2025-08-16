import { Request, Response } from 'express';
import { initDB } from '../db/db';
import { UserBasicData } from '../types/UserManagement';

/**
 * Obtener información del usuario autenticado
 */
export const getUser = async (req: Request, res: Response) => {
  try {
    const username = req.user?.user.username;
    if (!username) return res.status(401).json({ error: 'Usuario no autenticado' });

    const db = await initDB();
    const user = await db.get(`SELECT * FROM users WHERE username = ?`, [username]);

    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.json({ user });
  } catch (err) {
    console.error('[GetUser Error]:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Obtener todos los usuarios
 */
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const db = await initDB();
    const users = await db.all(`SELECT * FROM users`);
    res.json({ users });
  } catch (err) {
    console.error('[GetAllUsers Error]:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Agregar puntos al usuario autenticado
 */
export const addPoints = async (req: Request, res: Response) => {
  try {
    const username = req.user?.user.username;
    if (!username) return res.status(401).json({ error: 'Usuario no autenticado' });

    const points = Number(req.body.points);
    if (isNaN(points) || points <= 0) return res.status(400).json({ error: 'Cantidad inválida' });

    const db = await initDB();
    const user = await db.get(`SELECT * FROM users WHERE username = ?`, [username]);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const newBalance = user.rafflePoints + points;

    await db.run(`UPDATE users SET rafflePoints = ? WHERE username = ?`, [newBalance, username]);

    res.json({ message: 'Puntos agregados', user: { ...user, rafflePoints: newBalance } });
  } catch (err) {
    console.error('[AddPoints Error]:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
