import { db } from "../db.js";

export function getPipeline() {
  return {
    to_do: db.cards.filter(c => c.status === "To Do"),
    doing: db.cards.filter(c => c.status === "Doing"),
    done: db.cards.filter(c => c.status === "Done"),
    blocked: db.cards.filter(c => c.status === "Blocked")
  };
}
