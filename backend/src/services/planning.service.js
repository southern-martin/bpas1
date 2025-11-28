import { db } from "../db.js";

const VALID_BUCKETS = ["Tomorrow", "Next Week", "Later", null];

export function getPlanning() {
  return {
    tomorrow: db.cards.filter(c => c.planning_bucket === "Tomorrow"),
    next_week: db.cards.filter(c => c.planning_bucket === "Next Week"),
    later: db.cards.filter(c => c.planning_bucket === "Later")
  };
}

export function updatePlanning(cardId, planningBucket) {
  const card = db.cards.find(c => c.id === cardId);
  if (!card) return null;

  if (!VALID_BUCKETS.includes(planningBucket)) {
    throw new Error("Invalid planning bucket");
  }

  card.planning_bucket = planningBucket;
  card.updated_at = new Date().toISOString();

  return card;
}
