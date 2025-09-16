import prisma from "../../prisma/prisma";

export async function getAllPositionsService(deptId: string) {
  return prisma.position.findMany({
    where: {
      isDeleted: false,
      department: {
        id: deptId,
        isDeleted: false
      }
    },
    include: {
      department: false
    }
  });
}

export async function getPositionService(id: string) {
  return prisma.position.findUnique({
    where: { id, isDeleted: false },
  });
}

export async function createPositionService(deptId: string, createData: { maleName: string, femaleName: string, description?: string }, userRequest: { id: string }) {
  return prisma.position.create({
    data: {
      maleName: createData.maleName,
      femaleName: createData.femaleName,
      description: createData.description ?? null,
      departmentId: deptId,
      createdBy: userRequest.id,
      updatedBy: userRequest.id,
      updatedAt: new Date(),
      createdAt: new Date()
    },
  });
}

export async function updatePositionService(id: string, dataUpdate: { maleName: string, femaleName: string, description?: string }, userRequest: { id: string }) {
  return prisma.position.update({
    where: { id, isDeleted: false },
    data: {
      maleName: dataUpdate.maleName,
      femaleName: dataUpdate.femaleName,
      description: dataUpdate.description ?? null,
      updatedBy: userRequest.id,
      updatedAt: new Date()
    },
  });
}

export async function deletePositionService(id: string, userRequest: { id: string }) {
  return prisma.position.update({
    where: { id, isDeleted: false },
    data: { isDeleted: true, deletedBy: userRequest.id, deletedAt: new Date() },
  });
}