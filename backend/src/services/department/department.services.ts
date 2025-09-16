import { TBL_Department, TBL_User } from "../../types/DataBase";
import { v4 as uuidv4 } from "uuid";
import prisma from "../../prisma/prisma";
import { CreateDepartmentDto, UpdateDepartmentDto } from "../../routes/department.routes";

export async function getAllDepartmentsService(orgId: string) {
  return prisma.department.findMany({
    where: {
      isDeleted: false,
      organization: {
        id: orgId,
        isDeleted: false
      }
    },
    include: {
      organization: false
    }
  });
}

export async function getDepartmentService(deptId: string) {
  return prisma.department.findUnique({
    where: { id: deptId, isDeleted: false },
  });
}

export async function updateDepartmentService(deptId: string, dataUpdate: UpdateDepartmentDto, userRequest: TBL_User) {
  return prisma.department.update({
    where: { id: deptId, isDeleted: false },
    data: {
      ...dataUpdate,
      updatedBy: userRequest.id,
      updatedAt: new Date()
    }
  });
}

export async function createDepartmentService(orgId: string, createData: CreateDepartmentDto, userRequest: TBL_User) {
  return prisma.department.create({
    data: {
      ...createData,
      createdBy: userRequest.id,
      updatedBy: userRequest.id,
      organizationId: orgId,
    },
  });
}

export async function deleteDepartmentService(deptId: string, userRequest: TBL_User) {
  return prisma.department.updateMany({
    where: { id: deptId, isDeleted: false },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: userRequest.id
    }
  });
}
