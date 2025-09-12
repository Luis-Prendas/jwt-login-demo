import { Prisma } from '@prisma/client';
import prisma from '../../prisma/prisma';
import bcrypt from "bcrypt";

export async function getUserByUsernameAndOrg(username: string, orgCode: string) {
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

export async function registerUserService(registerData: Prisma.UserCreateInput, newUuid: string) {
  const SALT_ROUNDS = 10;
  const hashedPassword = await bcrypt.hash(registerData.password, SALT_ROUNDS);
  await prisma.user.create({
    data: {
      ...registerData,
      id: newUuid,
      password: hashedPassword,
    },
  });
}