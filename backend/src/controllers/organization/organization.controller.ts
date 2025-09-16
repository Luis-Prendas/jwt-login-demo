import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { ApiError } from '../../utils/ApiError';
import { getLogger } from '../../utils/logger';
import { CreateOrganizationDto, UpdateOrganizationDto } from '../../routes/organization.routes';
import { createOrganizationService, deleteOrganizationService, getAllOrganizationService, getOrganizationService, updateOrganizationService } from '../../services/organization/organization.services';

const logger = getLogger('api/organization');

// GET ALL
export const getAllOrg = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`------------ ${req.method} ${req.originalUrl} Iniciado ------------`);

  const orgs = await getAllOrganizationService();
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

  const org = await getOrganizationService(id);
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
  const createData: CreateOrganizationDto = req.body.content;
  const id = await createOrganizationService(createData, userRequest);
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

  const dataUpdate: UpdateOrganizationDto = req.body.content;
  const userRequest = req.body.userRequest;
  const id = req.params.id;
  if (!id) {
    logger.warning(`ID no proporcionado`);
    throw new ApiError(400, 'ID required');
  }

  const ok = await updateOrganizationService(id, dataUpdate, userRequest);
  if (!ok) {
    logger.warning(`Organización no actualizada`);
    throw new ApiError(404, 'Organization not updated');
  }

  logger.info(`Organización actualizada -> ${JSON.stringify(id)}`);
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
  const ok = await deleteOrganizationService(id, userRequest);
  if (!ok) {
    logger.warning(`Organizacion no eliminada`);
    throw new ApiError(404, 'Organization not found');
  }

  logger.info(`Orgnizacion eliminada -> ${JSON.stringify(id)}`);
  logger.info(`------------ ${req.method} ${req.originalUrl} Finalizado ------------`);
  res.json({ success: true });
});
