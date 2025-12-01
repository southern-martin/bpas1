import { api } from "../api/client.js";
import { getQueue, removeQueue } from "./db.js";
import { useSyncStatus } from "./syncStatus.js";

export async function processQueue() {
  if (!navigator.onLine) return 0;
  const items = await getQueue();
  if (!items.length) return 0;

  let synced = 0;

  // Try batch sync first
  try {
    await api.post("/sync", { items });
    for (const item of items) {
      await removeQueue(item.id);
    }
    synced = items.length;
    localStorage.setItem("lastSync", Date.now().toString());
    return synced;
  } catch (err) {
    console.warn("Batch sync failed, falling back to individual sync", err);
  }
  for (const item of items) {
    try {
      await sendToServer(item);
      await removeQueue(item.id);
      synced += 1;
    } catch (err) {
      console.error("Sync failed for item", item.id, err);
      // continue to next item to avoid blocking the queue if one fails
      continue;
    }
  }

  if (synced > 0) {
    localStorage.setItem("lastSync", Date.now().toString());
  }

  return synced;
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

export async function runSync() {
  const { setStatus, setLastSync } = useSyncStatus.getState();
  setStatus("syncing");
  try {
    await processQueue();
    setStatus("ok");
    setLastSync(Date.now());
  } catch (err) {
    console.error("Sync error", err);
    setStatus("error");
  }
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
