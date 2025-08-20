import { Request, Response } from 'express';
import { initDB } from '../db/db';

/**
 * Retorna todas las asistencias del usuario.
 */
export const getAllUserAssistance = async (req: Request, res: Response) => {
  try {
    const userId = req.body.content.userUuid;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const db = await initDB();
    const assistance = await db.all('SELECT * FROM attendance WHERE userUuid = ?', [userId]);
    res.json(assistance);
  } catch (error) {
    console.error('Error fetching user assistance:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
