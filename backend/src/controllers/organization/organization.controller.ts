import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { ApiError } from '../../utils/ApiError';
import { getLogger } from '../../utils/logger';
import { CreateOrganizationDto, UpdateOrganizationDto } from '../../routes/organization.routes';
import { createOrganizationService, deleteOrganizationService, getAllOrganizationService, getOrganizationService, updateOrganizationService } from '../../services/organization/organization.services';

const logger = getLogger('api/organization');

// GET ALL
export const getAllOrg = asyncHandler(async (req: Request, res: Response) => {

  const orgs = await getAllOrganizationService();
  if (!orgs || orgs.length === 0) {
    logger.warn(`Orgnizaciones no encontradas\n`);
    throw new ApiError(404, 'No organizations found');
  }

  logger.info(`Orgnizaciones encontradas -> ${JSON.stringify(orgs)}`);
  res.json({ data: orgs });
});

// GET ONE
export const getOrg = asyncHandler(async (req: Request, res: Response) => {

  const id = req.params.id;
  if (!id) {
    logger.warn(`ID no proporcionado\n`);
    throw new ApiError(400, 'ID required');
  }

  const org = await getOrganizationService(id);
  if (!org) {
    logger.warn(`Orgnizacion no encontrada\n`);
    throw new ApiError(404, 'Organization not found');
  }

  logger.info(`Orgnizacion encontrada -> ${JSON.stringify(org)}`);
  res.json({ data: org });
});

// CREATE
export const createOrganization = asyncHandler(async (req: Request, res: Response) => {

  const userRequest = req.user!;
  const createData: CreateOrganizationDto = req.body;
  const id = await createOrganizationService(createData, userRequest);
  if (!id) {
    logger.warn(`Orgnizacion no creada\n`);
    throw new ApiError(404, 'Organization not created');
  }

  logger.info(`Orgnizacion creada -> ${JSON.stringify(id)}`);
  res.json({ data: id });
});

// UPDATE
export const updateOrganization = asyncHandler(async (req: Request, res: Response) => {

  const dataUpdate: UpdateOrganizationDto = req.body;
  const userRequest = req.user!;
  const id = req.params.id;
  if (!id) {
    logger.warn(`ID no proporcionado\n`);
    throw new ApiError(400, 'ID required');
  }

  const ok = await updateOrganizationService(id, dataUpdate, userRequest);
  if (!ok) {
    logger.warn(`Organización no actualizada\n`);
    throw new ApiError(404, 'Organization not updated');
  }

  logger.info(`Organización actualizada -> ${JSON.stringify(id)}`);
  res.json({ success: true });
});

// DELETE
export const deleteOrganization = asyncHandler(async (req: Request, res: Response) => {

  const id = req.params.id;
  if (!id) {
    logger.warn(`ID no proporcionado\n`);
    throw new ApiError(400, 'ID required');
  }

  const userRequest = req.user!;
  const ok = await deleteOrganizationService(id, userRequest);
  if (!ok) {
    logger.warn(`Organizacion no eliminada\n`);
    throw new ApiError(404, 'Organization not found');
  }

  logger.info(`Orgnizacion eliminada -> ${JSON.stringify(id)}`);
  res.json({ success: true });
});
