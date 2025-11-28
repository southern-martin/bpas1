import { db } from "../db.js";
import { v4 as uuid } from "uuid";

export function createCard(data) {
  const newCard = {
    id: uuid(),
    // Required
    title: data.title,
    type: data.type,
    status: "To Do",
    // Optional links
    linked_client_id: data.linked_client_id || null,
    linked_project_id: data.linked_project_id || null,
    assigned_to_user_id: data.assigned_to_user_id || null,
    // Notes
    notes_raw: "",
    notes_clarified: "",
    // Optional event time
    event_time: data.event_time || null,
    // Planning bucket (owner planning page)
    planning_bucket: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  db.cards.push(newCard);
  return newCard;
}

export function getCards(filters) {
  return db.cards.filter(card => {
    if (filters.assigned_to && card.assigned_to_user_id !== filters.assigned_to) return false;
    if (filters.client_id && card.linked_client_id !== filters.client_id) return false;
    if (filters.project_id && card.linked_project_id !== filters.project_id) return false;
    if (filters.status && card.status !== filters.status) return false;
    if (filters.type && card.type !== filters.type) return false;
    return true;
  });
}

export function getCardById(id) {
  return db.cards.find(card => card.id === id);
}

export function updateCard(id, updates) {
  const card = getCardById(id);
  if (!card) return null;

  Object.assign(card, updates);
  card.updated_at = new Date().toISOString();

  return card;
}

export function updateCardActivity(id, updates) {
  const card = getCardById(id);
  if (!card) return null;

  if (updates.status) {
    card.status = updates.status;
  }

  if (updates.notes_clarified) {
    card.notes_clarified = updates.notes_clarified;
  }

  card.updated_at = new Date().toISOString();

  db.activities.push({
    id: uuid(),
    card_id: card.id,
    user_id: updates.user_id || null,
    status_after: card.status,
    notes_added: updates.notes_clarified || "",
    created_at: new Date().toISOString()
  });

  return card;
}
