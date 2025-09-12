import prisma from "../../prisma/prisma";

export async function getUserByIdService(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId, isDeleted: false },
  });
}

export async function getUserByUsernameService(username: string) {
  return prisma.user.findUnique({
    where: { username, isDeleted: false },
  });
}
