import { api } from "../../api/client.js";

export async function fetchPlanning() {
  const res = await api.get("/planning");
  return res.data;
}

export async function movePlanning(cardId, planningBucket) {
  return api.patch(`/planning/${cardId}`, { planning_bucket: planningBucket });
}
