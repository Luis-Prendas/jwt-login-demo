import { Request, Response } from 'express';
import { initDB } from '../../db/db';
import { getLogger } from '../../utils/logger';

const logger = getLogger('api-badge');

export const getUserBadges = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    if (!id) {
      logger.warn('ID de usuario no proporcionado en la solicitud');
      return res.status(400).json({ error: 'ID de usuario no proporcionado' });
    }
    logger.info(`Obteniendo insignias del usuario con ID: ${id}`);
    const db = await initDB();
    const badges = await db.all(
      `
      SELECT b.*
      FROM userBadge ub
      JOIN badge b ON ub.badgeId = b.id
      WHERE ub.userId = ?
      `, [id]);
    if (badges.length === 0) {
      logger.info(`No se encontraron insignias para el usuario con ID: ${id}`);
      return res.status(404).json({ error: 'No se encontraron insignias para este usuario.' });
    }
    logger.info(`Insignias encontradas para el usuario con ID ${id}: ${JSON.stringify(badges)}`);
    return res.status(200).json({ badges });
  } catch (error) {
    logger.error(`[GetUserBadges Error]: ${(error as Error).message}`);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  } finally {
    logger.info(`------------ ${req.method} ${req.originalUrl} finalizado ------------`);
  }
};