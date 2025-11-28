import { v4 as uuid } from "uuid";

export const db = {
  cards: [],
  activities: [],
  clients: [],
  projects: []
};

// Seed example card for quick testing
db.cards.push({
  id: uuid(),
  type: "Task",
  title: "Example test card",
  status: "To Do",
  linked_client_id: null,
  linked_project_id: null,
  assigned_to_user_id: "staff-1",
  notes_raw: "",
  notes_clarified: "",
  event_time: null,
  planning_bucket: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
});
