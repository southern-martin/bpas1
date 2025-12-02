import { api } from "../../api/client.js";

export async function fetchClients() {
  const res = await api.get("/clients");
  return res.data;
}

export async function fetchClient(id) {
  const res = await api.get(`/clients/${id}`);
  return res.data;
}

export function createClient(payload) {
  return api.post("/clients", payload);
}

export function updateClient(id, payload) {
  return api.put(`/clients/${id}`, payload);
}

export function deleteClient(id) {
  return api.delete(`/clients/${id}`);
}
