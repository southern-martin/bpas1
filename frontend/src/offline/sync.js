import { api } from "../api/client.js";
import { getQueue, removeQueue } from "./db.js";

export async function processQueue() {
  if (!navigator.onLine) return;
  const items = await getQueue();
  if (!items.length) return;

  // Try batch sync first
  try {
    await api.post("/sync", { items });
    for (const item of items) {
      await removeQueue(item.id);
    }
    return;
  } catch (err) {
    console.warn("Batch sync failed, falling back to individual sync", err);
  }
  for (const item of items) {
    try {
      await sendToServer(item);
      await removeQueue(item.id);
    } catch (err) {
      console.error("Sync failed for item", item.id, err);
      // continue to next item to avoid blocking the queue if one fails
      continue;
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
    case "audio-upload": {
      const blob = dataUrlToBlob(item.payload.dataUrl);
      const formData = new FormData();
      formData.append("audio", blob, "offline-recording.webm");
      const transcript = await api.post("/audio/transcribe", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const text = transcript.data.raw_text || "";
      if (text) {
        const userId = localStorage.getItem("userId") || "staff-1";
        await api.post(`/cards/${item.payload.cardId}/updates`, {
          notes_clarified: text,
          user_id: userId
        });
      }
      break;
    }
    default:
      throw new Error("Unknown queue item");
  }
}

export function initSyncLoop() {
  window.addEventListener("online", () => processQueue());
  setInterval(() => processQueue(), 15000);
}

function dataUrlToBlob(dataUrl) {
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}
