import { api } from "../../api/client.js";

export async function fetchPipeline() {
  const res = await api.get("/pipeline");
  return res.data;
}

export async function fetchClients() {
  const res = await api.get("/clients");
  return res.data;
}

export async function fetchProjects() {
  const res = await api.get("/projects");
  return res.data;
}

export function updateCardStatus(cardId, status) {
  return api.patch(`/cards/${cardId}`, { status });
}
