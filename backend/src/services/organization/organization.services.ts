import prisma from '../../prisma/prisma';

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

export async function createOrganizationService(createData: {
  corporateName: string,
  displayName: string,
  slogan?: string,
  description?: string
}, userRequest: { id: string }) {
  const organizationCode = Math.floor(Math.random() * 9000 + 1000).toString();
  const org = await prisma.organization.create({
    data: {
      corporateName: createData.corporateName,
      displayName: createData.displayName,
      organizationCode,
      logoUrl: null,
      slogan: createData.slogan ?? null,
      description: createData.description ?? null,
      createdBy: userRequest.id,
      updatedBy: userRequest.id,
    },
  });
  return org.id;
}

export async function updateOrganizationService(orgId: string, dataUpdate: { corporateName: string, displayName: string, slogan?: string }, userRequest: { id: string }) {
  const updated = await prisma.organization.updateMany({
    where: { id: orgId, isDeleted: false },
    data: {
      corporateName: dataUpdate.corporateName,
      displayName: dataUpdate.displayName,
      slogan: dataUpdate.slogan ?? null,
      updatedBy: userRequest.id
    }
  });
  return updated.count > 0;
}

export async function deleteOrganizationService(orgId: string, userRequest: { id: string }) {
  const updated = await prisma.organization.updateMany({
    where: { id: orgId, isDeleted: false },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: userRequest.id,
    }
  });
  return updated.count > 0;
}
