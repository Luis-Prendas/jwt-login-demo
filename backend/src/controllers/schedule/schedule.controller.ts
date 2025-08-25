import { Request, Response } from 'express';
import { initDB } from '../../db/db';
import { getLogger } from '../../utils/logger';
import { TBL_Schedule } from '../../types/DataBase';

const logger = getLogger('api-schedule');

export const getSchedule = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      logger.warn('ID de usuario no proporcionado en la solicitud');
      return res.status(400).json({ error: 'ID de usuario requerido' });
    }
    logger.info(`Obteniendo horario para el usuario con ID: ${userId}`);
    const db = await initDB();
    const schedule = await db.all('SELECT * FROM schedule WHERE userId = ?', [userId]) as TBL_Schedule[];
    if (!schedule || schedule.length === 0) {
      logger.warn(`No se encontró ningún horario para el usuario con ID: ${userId}`);
      return res.status(404).json({ error: 'No se encontró ningún horario' });
    }
    logger.info(`Horario encontrado: ${JSON.stringify(schedule)}`);
    res.json(schedule);
  } catch (error) {
    logger.error('[GetSchedule Error]:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    logger.info(`------------ ${req.method} ${req.originalUrl} finalizado ------------`);
  }
};