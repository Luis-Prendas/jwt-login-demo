import { Request, Response } from 'express';
import { initDB } from '../db/db';

/**
   * Retorna todo el horario del usuario.
   */
export const getAllUserSchedule = async (req: Request, res: Response) => {
  try {
    const userId = req.body.content.userUuid;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const db = await initDB();
    const schedule = await db.all('SELECT * FROM schedules WHERE userUuid = ?', [userId]);
    res.json(schedule);
  } catch (error) {
    console.error('Error al obtener el horario del usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};