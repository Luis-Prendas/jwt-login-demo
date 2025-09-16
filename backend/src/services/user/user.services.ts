import prisma from "../../prisma/prisma";

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

export async function deleteUserService(id: string, userRequest: { id: string }) {
  return prisma.user.update({
    where: { id, isDeleted: false },
    data: { isDeleted: true, deletedBy: userRequest.id, deletedAt: new Date() },
  });
}