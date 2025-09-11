import { Request, Response } from "express";
import { getLogger } from "../../utils/logger";
import { initDB } from "../../db/db";
import { gerAllOrg } from "../../services/organization/organization.services";

const logger = getLogger('api-organization');

export const getAllOrg = async (req: Request, res: Response): Promise<Response> => {
  try {
    logger.info('Obteniendo todos las organizaciones');
    const db = await initDB();
    const org = await gerAllOrg(db)
    if (!org || org.length === 0) {
      logger.warn('No se encontraron organizaciones');
      return res.status(404).json({ error: 'No se encontraron organizaciones' });
    }
    logger.info(`Organizaciones encontrados: ${JSON.stringify(org)}`);
    return res.json({ data: org })
  } catch (err) {
    logger.error('[getAllOrg Error]:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    logger.info(`------------ ${req.method} ${req.originalUrl} finalizado ------------`);
    logger.info('');
  }
};