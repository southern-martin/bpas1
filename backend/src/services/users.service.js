import { prisma } from "../db/prisma.js";

export function getUsers() {
  return prisma.user.findMany();
}

export function createUser(data) {
  return prisma.user.create({
    data: {
      name: data.name,
      role: data.role,
      email: data.email || null
    }
  });
}
