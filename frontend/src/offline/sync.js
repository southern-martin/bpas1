import { api } from "../api/client.js";
import { getQueue, removeQueue } from "./db.js";

export async function processQueue() {
  if (!navigator.onLine) return;
  const items = await getQueue();
  for (const item of items) {
    try {
      await sendToServer(item);
      await removeQueue(item.id);
    } catch (err) {
      console.error("Sync failed for item", item.id, err);
      break;
    }
  }
}

async function sendToServer(item) {
  switch (item.type) {
    case "card-update":
      await api.post(`/cards/${item.payload.id}/updates`, item.payload.body);
      break;
    case "card-create":
      await api.post("/cards", item.payload.body);
      break;
    case "activity":
      await api.post(`/cards/${item.payload.cardId}/updates`, item.payload.body);
      break;
    default:
      throw new Error("Unknown queue item");
  }
}

export function initSyncLoop() {
  window.addEventListener("online", () => processQueue());
  setInterval(() => processQueue(), 15000);
}
