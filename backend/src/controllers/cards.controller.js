import * as cardsService from "../services/cards.service.js";

export async function createCard(req, res) {
  try {
    const card = await cardsService.createCard(req.body);
    res.status(201).json(card);
  } catch (err) {
    console.error("Create Card Error:", err);
    res.status(500).json({ error: "Failed to create card" });
  }
}

export async function getCards(req, res) {
  try {
    const filters = { ...req.query };
    if (req.user?.role === "Staff") {
      filters.assigned_to = req.user.id;
    }
    const result = await cardsService.getCards(filters);
    res.json(result);
  } catch (err) {
    console.error("Get Cards Error:", err);
    res.status(500).json({ error: "Failed to load cards" });
  }
}

export async function getCardById(req, res) {
  try {
    const card = await cardsService.getCardById(req.params.id);
    if (!card) return res.status(404).json({ error: "Card not found" });
    if (req.user?.role === "Staff" && card.assigned_to_user_id !== req.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }
    res.json(card);
  } catch (err) {
    console.error("Get Card Error:", err);
    res.status(500).json({ error: "Failed to load card" });
  }
}

export async function updateCard(req, res) {
  try {
    const updated = await cardsService.updateCard(req.params.id, req.body);
    updated ? res.json(updated) : res.status(404).json({ error: "Card not found" });
  } catch (err) {
    console.error("Update Card Error:", err);
    res.status(500).json({ error: "Failed to update card" });
  }
}

export async function updateCardActivity(req, res) {
  try {
    if (req.user?.role === "Staff") {
      const card = await cardsService.getCardById(req.params.id);
      if (!card) return res.status(404).json({ error: "Card not found" });
      if (card.assigned_to_user_id !== req.user.id) {
        return res.status(403).json({ error: "Forbidden" });
      }
    }
    const updated = await cardsService.updateCardActivity(req.params.id, req.body);
    updated ? res.json(updated) : res.status(404).json({ error: "Card not found" });
  } catch (err) {
    console.error("Card Activity Error:", err);
    res.status(500).json({ error: "Failed to update card activity" });
  }
}
