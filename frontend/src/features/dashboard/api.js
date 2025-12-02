import { api } from "../../api/client.js";

export async function fetchCards() {
  const res = await api.get("/cards");
  return res.data || [];
}

export async function fetchRecentActivities() {
  const res = await api.get("/activities/recent");
  return res.data || [];
}
