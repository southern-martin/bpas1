import { api } from "../../api/client.js";

export async function fetchProjects() {
  const res = await api.get("/projects");
  return res.data;
}

export async function fetchClients() {
  const res = await api.get("/clients");
  return res.data;
}

export function createProject(payload) {
  return api.post("/projects", payload);
}

export function updateProject(id, payload) {
  return api.patch(`/projects/${id}`, payload);
}

export function deleteProject(id) {
  return api.delete(`/projects/${id}`);
}

export async function fetchProjectById(id) {
  const res = await api.get(`/projects/${id}`);
  return res.data;
}

export async function fetchProjectCards(id) {
  const res = await api.get(`/projects/${id}/cards`);
  return res.data;
}
