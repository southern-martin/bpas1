import { prisma } from "../db/prisma.js";

export function createClient(data) {
  return prisma.client.create({
    data: {
      name: data.name,
      phone: data.phone || null,
      email: data.email || null,
      address: data.address || null,
      notes: data.notes || null
    }
  });
}

export function getClients() {
  return prisma.client.findMany({
    orderBy: { created_at: "desc" }
  });
}

export function getClientById(id) {
  return prisma.client.findUnique({
    where: { id },
    include: { projects: true }
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
    data: {
      name: data.name ?? exists.name,
      phone: data.phone ?? exists.phone,
      email: data.email ?? exists.email,
      address: data.address ?? exists.address,
      notes: data.notes ?? exists.notes
    }
  });
}

export async function deleteClient(id) {
  const exists = await prisma.client.findUnique({ where: { id } });
  if (!exists) return null;
  await prisma.client.delete({ where: { id } });
  return true;
}
