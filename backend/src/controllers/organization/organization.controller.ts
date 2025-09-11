import { Request, Response } from "express";
import { getLogger } from "../../utils/logger";
import { initDB } from "../../db/db";
import { getAllOrgService, getOrgService, updateOrganizationService } from "../../services/organization/organization.services";

const logger = getLogger('api-organization');

export const getAllOrg = async (req: Request, res: Response): Promise<Response> => {
  try {
    logger.info('Obteniendo todos las organizaciones');
    const db = await initDB();
    const org = await getAllOrgService(db)
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

export const getOrg = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    if (!id) {
      logger.warn('ID de la organizacion no proporcionado en la solicitud');
      return res.status(400).json({ error: 'ID de la organizacion no proporcionado' });
    }
    logger.info(`Obteniendo organizacion -> { ${id} }`);
    const db = await initDB();
    const org = await getOrgService(db, id)
    if (!org) {
      logger.warn(`Organizacion no encontrado -> { ${id} }`);
      return res.status(404).json({ error: 'Organizacion no encontrado' });
    }
    logger.info(`Organizacion encontrado -> { ${id} }`);
    return res.json({ org })
  } catch (err) {
    logger.error('[getOrg Error]:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    logger.info(`------------ ${req.method} ${req.originalUrl} finalizado ------------`);
    logger.info('');
  }
};

export interface UpdateOrg {
  corporateName: string
  displayName: string
  slogan: string
}
export const updateOrganization = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const dataUpdate: UpdateOrg = req.body.content
    if (!id || !dataUpdate.corporateName || !dataUpdate.displayName) {
      logger.warn(`ID de usuario o datos de la organizacion no proporcionados -> { ${id} | ${dataUpdate.corporateName} | ${dataUpdate.displayName} | ${dataUpdate.slogan ? dataUpdate.slogan : 'null'} }`);
      return res.status(400).json({ error: 'ID de usuario o datos de la organizacion no proporcionados' });
    }
    logger.info(`Actualizando organizacion > { ${id} | ${dataUpdate.corporateName} | ${dataUpdate.displayName} | ${dataUpdate.slogan ? dataUpdate.slogan : 'null'} }`);
    const db = await initDB();
    const result = updateOrganizationService(db, dataUpdate, id)
    if (!result) {
      logger.warn(`No se pudo actualizar la organizacion > { ${id} | ${dataUpdate.corporateName} | ${dataUpdate.displayName} | ${dataUpdate.slogan ? dataUpdate.slogan : 'null'} }`);
      return res.status(404).json({ error: 'No se pudo actualizar la organizacion' });
    }
    logger.info(`Organizacion actualizado con éxito > { ${id} | ${dataUpdate.corporateName} | ${dataUpdate.displayName} | ${dataUpdate.slogan ? dataUpdate.slogan : 'null'} }`);
    return res.json({ success: true });
  } catch (err) {
    logger.error('[updateOrganization Error]:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    logger.info(`------------ ${req.method} ${req.originalUrl} finalizado ------------`);
    logger.info('');
  }
};