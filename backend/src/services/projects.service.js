import { prisma } from "../db/prisma.js";

export function createProject(data) {
  return prisma.project.create({
    data: {
      name: data.name,
      client_id: data.client_id
    }
  });
}

export function getProjects() {
  return prisma.project.findMany();
}

export function getProjectById(id) {
  return prisma.project.findUnique({
    where: { id }
  });
}

export async function updateProject(id, data) {
  const exists = await prisma.project.findUnique({ where: { id } });
  if (!exists) return null;
  return prisma.project.update({
    where: { id },
    data
  });
}

export async function deleteProject(id) {
  const exists = await prisma.project.findUnique({ where: { id } });
  if (!exists) return null;
  await prisma.project.delete({ where: { id } });
  return true;
}
