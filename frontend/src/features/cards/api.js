import { api } from "../../api/client.js";

export async function fetchCard(id) {
  const res = await api.get(`/cards/${id}`);
  return res.data;
}

export async function updateCard(id, payload) {
  const res = await api.patch(`/cards/${id}`, payload);
  return res.data;
}

export async function createCard(payload) {
  const res = await api.post("/cards", payload);
  return res.data;
}

export function prefillCard(text) {
  return api.post("/ai/prefill-card", { text });
}

export function updatePlanning(cardId, payload) {
  return api.patch(`/planning/${cardId}`, payload);
}
