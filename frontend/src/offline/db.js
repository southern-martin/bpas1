import Dexie from "dexie";

export const db = new Dexie("bpas-field");

db.version(1).stores({
  cards: "id, status, type, assigned_to_user_id, linked_client_id, linked_project_id, updated_at",
  clients: "id, name",
  projects: "id, name, client_id",
  activities: "id, card_id, created_at",
  queue: "id, type, timestamp",
  files: "id, card_id",
  audio: "id, card_id"
});

export async function enqueue(item) {
  return db.queue.put({ ...item, timestamp: item.timestamp || Date.now() });
}

export async function getQueue() {
  return db.queue.orderBy("timestamp").toArray();
}

export async function removeQueue(id) {
  return db.queue.delete(id);
}

export async function upsertCards(list = []) {
  if (!list.length) return;
  await db.cards.bulkPut(list.map(c => ({ ...c, updated_at: c.updated_at || Date.now() })));
}

export async function getCardsFromCache() {
  return db.cards.toArray();
}
