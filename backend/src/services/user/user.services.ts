import prisma from "../../prisma/prisma";
import { CreateUserDto, UpdateUserDto } from "../../routes/user.routes";
import bcrypt from "bcrypt";

export async function getUserService(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId, isDeleted: false },
  });
}

export async function getUserByUsernameService(username: string) {
  return prisma.user.findUnique({
    where: { username, isDeleted: false },
  });
}

export async function getAllUserService(orgId: string) {
  return prisma.user.findMany({
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

export async function updateUserService(id: string, dataUpdate: UpdateUserDto, userRequest: { id: string }) {
  return prisma.user.update({
    where: { id: id, isDeleted: false },
    data: {
      ...dataUpdate,
      updatedBy: userRequest.id,
    }
  });
}

export async function createUserService(id: string, createData: CreateUserDto, userRequest: { id: string }) {
  const SALT_ROUNDS = 10;
  const hashedPassword = await bcrypt.hash(createData.password, SALT_ROUNDS);
  return prisma.user.create({
    data: {
      ...createData,
      password: hashedPassword,
      updatedBy: userRequest.id,
      createdBy: userRequest.id,
    }
  });
}

export async function deleteUserService(id: string, userRequest: { id: string }) {
  return prisma.user.update({
    where: { id, isDeleted: false },
    data: { isDeleted: true, deletedBy: userRequest.id, deletedAt: new Date() },
  });
}

export async function getUserByUsernameAndOrgCodeService(username: string, orgCode: string) {
  return prisma.user.findFirst({
    where: {
      username,
      isDeleted: false,
      organization: {
        organizationCode: orgCode,
        isDeleted: false
      }
    },
    include: {
      organization: false,
    }
  });
}