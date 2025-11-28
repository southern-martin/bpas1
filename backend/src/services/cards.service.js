import { prisma } from "../db/prisma.js";

export async function createCard(data) {
  return prisma.card.create({
    data: {
      title: data.title,
      type: data.type,
      status: "To Do",
      linked_client_id: data.linked_client_id || null,
      linked_project_id: data.linked_project_id || null,
      assigned_to_user_id: data.assigned_to_user_id || null,
      notes_raw: "",
      notes_clarified: "",
      event_time: data.event_time || null,
      planning_bucket: null
    }
  });
}

export async function getCards(filters) {
  return prisma.card.findMany({
    where: {
      assigned_to_user_id: filters.assigned_to || undefined,
      linked_client_id: filters.client_id || undefined,
      linked_project_id: filters.project_id || undefined,
      status: filters.status || undefined,
      type: filters.type || undefined
    }
  });
}

export async function getCardById(id) {
  return prisma.card.findUnique({
    where: { id }
  });
}

export async function updateCard(id, updates) {
  return prisma.card.update({
    where: { id },
    data: updates
  });
}

export async function updateCardActivity(id, updates) {
  const updatedCard = await prisma.card.update({
    where: { id },
    data: {
      status: updates.status || undefined,
      notes_clarified: updates.notes_clarified || undefined
    }
  });

  await prisma.activity.create({
    data: {
      card_id: id,
      user_id: updates.user_id || null,
      status_after: updates.status || null,
      notes_added: updates.notes_clarified || null
    }
  });

  return updatedCard;
}
