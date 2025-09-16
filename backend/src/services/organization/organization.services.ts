import prisma from '../../prisma/prisma';
import { CreateOrganizationDto, UpdateOrganizationDto } from '../../routes/organization.routes';

export async function getAllOrganizationService() {
  return prisma.organization.findMany({
    where: { isDeleted: false },
  });
}

export async function getOrganizationService(orgId: string) {
  return prisma.organization.findUnique({
    where: { id: orgId, isDeleted: false },
  });
}

export async function createOrganizationService(createData: CreateOrganizationDto, userRequest: { id: string }) {
  const organizationCode = Math.floor(Math.random() * 9000 + 1000).toString();
  return await prisma.organization.create({
    data: {
      ...createData,
      createdAt: new Date(),
      createdBy: userRequest.id,
      updatedAt: new Date(),
      updatedBy: userRequest.id,
      organizationCode,
    },
  });
}

export async function updateOrganizationService(orgId: string, dataUpdate: UpdateOrganizationDto, userRequest: { id: string }) {
  return await prisma.organization.updateMany({
    where: { id: orgId, isDeleted: false },
    data: {
      ...dataUpdate,
      updatedAt: new Date(),
      updatedBy: userRequest.id,
    }
  });
}

export async function deleteOrganizationService(orgId: string, userRequest: { id: string }) {
  return await prisma.organization.updateMany({
    where: { id: orgId, isDeleted: false },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: userRequest.id,
    }
  });
}
