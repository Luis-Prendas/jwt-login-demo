import { Request, Response } from 'express';
import { initDB } from '../../db/db';
import { getLogger } from '../../utils/logger';
import { TBL_Attendance } from '../../types/DataBase';

const logger = getLogger('api-attendance');

export const getAttendance = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { userId, date } = req.params;
    if (!userId || !date) {
      logger.warn('Faltan parámetros en la solicitud');
      return res.status(400).json({ error: 'Faltan parámetros' });
    }
    logger.info(`Obteniendo asistencia para el usuario con ID: ${userId} y fecha: ${date}`);

    const db = await initDB();

    // Comparamos solo el día (YYYY-MM-DD)
    const attendance = await db.get(
      'SELECT * FROM attendance WHERE userId = ? AND substr(date,1,10) = substr(?,1,10)',
      [userId, date]
    ) as TBL_Attendance;

    if (!attendance) {
      logger.warn(`No se encontró asistencia para el usuario con ID: ${userId} y fecha: ${date}`);
      return res.status(404).json({ error: 'Asistencia no encontrada' });
    }

    logger.info(`Asistencia encontrada: ${JSON.stringify(attendance)}`);
    return res.json({ attendance });

  } catch (error) {
    logger.error('[GetAttendance Error]:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    logger.info(`------------ ${req.method} ${req.originalUrl} finalizado ------------`);
  }
};
