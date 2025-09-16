import prisma from "../../prisma/prisma";
import { CreatePositionDto, UpdatePositionDto } from "../../routes/position.routes";

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

export async function createPositionService(deptId: string, createData: CreatePositionDto, userRequest: { id: string }) {
  return prisma.position.create({
    data: {
      ...createData,
      createdBy: userRequest.id,
      updatedBy: userRequest.id,
      departmentId: deptId,
    },
  });
}

export async function updatePositionService(id: string, dataUpdate: UpdatePositionDto, userRequest: { id: string }) {
  return prisma.position.update({
    where: { id, isDeleted: false },
    data: {
      ...dataUpdate,
      updatedBy: userRequest.id,
    },
  });
}

export async function deletePositionService(id: string, userRequest: { id: string }) {
  return prisma.position.update({
    where: { id, isDeleted: false },
    data: { isDeleted: true, deletedBy: userRequest.id, deletedAt: new Date() },
  });
}