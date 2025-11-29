import { prisma } from "../db/prisma.js";

export function createClient(data) {
  return prisma.client.create({
    data: { name: data.name }
  });
}

export function getClients() {
  return prisma.client.findMany();
}

export function getClientById(id) {
  return prisma.client.findUnique({
    where: { id }
  });
}

export function getClientCards(id) {
  return prisma.card.findMany({
    where: { linked_client_id: id },
    orderBy: { created_at: "desc" }
  });
}

export async function updateClient(id, data) {
  const exists = await prisma.client.findUnique({ where: { id } });
  if (!exists) return null;
  return prisma.client.update({
    where: { id },
    data
  });
}

export async function deleteClient(id) {
  const exists = await prisma.client.findUnique({ where: { id } });
  if (!exists) return null;
  await prisma.client.delete({ where: { id } });
  return true;
}
