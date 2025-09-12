import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import * as service from '../../services/organization/organization.services';
import { ApiError } from '../../utils/ApiError';
import { getLogger } from '../../utils/logger';

const logger = getLogger('api/organization');

// GET ALL
export const getAllOrg = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`------------ ${req.method} ${req.originalUrl} Iniciado ------------`);
  const orgs = await service.getAllOrganizationService();
  if (!orgs || orgs.length === 0) {
    logger.warning(`Orgnizaciones no encontradas`);
    throw new ApiError(404, 'No organizations found');
  }
  logger.info(`Orgnizaciones encontradas -> ${JSON.stringify(orgs)}`);
  logger.info(`------------ ${req.method} ${req.originalUrl} Finalizado ------------`);
  logger.info('');
  res.json({ data: orgs });
});

// GET ONE
export const getOrg = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`------------ ${req.method} ${req.originalUrl} Iniciado ------------`);
  const id = req.params.id;
  if (!id) {
    logger.warning(`ID no proporcionado`);
    throw new ApiError(400, 'ID required');
  }
  const org = await service.getOrganizationService(id);
  if (!org) {
    logger.warning(`Orgnizacion no encontrada`);
    throw new ApiError(404, 'Organization not found');
  }
  logger.info(`Orgnizacion encontrada -> ${JSON.stringify(org)}`);
  logger.info(`------------ ${req.method} ${req.originalUrl} Finalizado ------------`);
  logger.info('');
  res.json({ data: org });
});

// CREATE
export const createOrganization = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`------------ ${req.method} ${req.originalUrl} Iniciado ------------`);
  const userRequest = req.body.userRequest;
  const createData = req.body.content;
  const id = await service.createOrganizationService(createData, userRequest);
  if (!id) {
    logger.warning(`Orgnizacion no creada`);
    throw new ApiError(404, 'Organization not created');
  }
  logger.info(`Orgnizacion creada -> ${JSON.stringify(id)}`);
  logger.info(`------------ ${req.method} ${req.originalUrl} Finalizado ------------`);
  logger.info('');
  res.json({ data: id });
});

// UPDATE
export const updateOrganization = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`------------ ${req.method} ${req.originalUrl} Iniciado ------------`);
  const id = req.params.id;
  if (!id) {
    logger.warning(`ID no proporcionado`);
    throw new ApiError(400, 'ID required');
  }
  const dataUpdate = req.body.content;
  const userRequest = req.body.userRequest;
  const ok = await service.updateOrganizationService(id, dataUpdate, userRequest);
  if (!ok) {
    logger.warning(`Organizacion no actualizada`);
    throw new ApiError(404, 'Organization not updated');
  }
  logger.info(`Orgnizacion actualizada -> ${JSON.stringify(id)}`);
  logger.info(`------------ ${req.method} ${req.originalUrl} Finalizado ------------`);
  logger.info('');
  res.json({ success: true });
});

// DELETE
export const deleteOrganization = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`------------ ${req.method} ${req.originalUrl} Iniciado ------------`);
  const id = req.params.id;
  if (!id) {
    logger.warning(`ID no proporcionado`);
    throw new ApiError(400, 'ID required');
  }
  const userRequest = req.body.userRequest;
  const ok = await service.deleteOrganizationService(id, userRequest);
  if (!ok) {
    logger.warning(`Organizacion no eliminada`);
    throw new ApiError(404, 'Organization not found');
  }
  logger.info(`Orgnizacion eliminada -> ${JSON.stringify(id)}`);
  logger.info(`------------ ${req.method} ${req.originalUrl} Finalizado ------------`);
  logger.info('');
  res.json({ success: true });
});
