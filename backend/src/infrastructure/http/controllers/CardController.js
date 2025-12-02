export class CardController {
  constructor({ createCard, getCards, getCardById, updateCard, updateCardActivity }) {
    this.createCardUseCase = createCard;
    this.getCardsUseCase = getCards;
    this.getCardByIdUseCase = getCardById;
    this.updateCardUseCase = updateCard;
    this.updateCardActivityUseCase = updateCardActivity;
  }

  createCard = async (req, res) => {
    try {
      const card = await this.createCardUseCase.execute(req.body);
      res.status(201).json(card);
    } catch (err) {
      console.error("Create Card Error:", err);
      res.status(500).json({ error: "Failed to create card" });
    }
  };

  getCards = async (req, res) => {
    try {
      const filters = { ...req.query };
      if (req.user?.role === "Staff") {
        filters.assigned_to = req.user.id;
      }
      const result = await this.getCardsUseCase.execute(filters);
      res.json(result);
    } catch (err) {
      console.error("Get Cards Error:", err);
      res.status(500).json({ error: "Failed to load cards" });
    }
  };

  getCardById = async (req, res) => {
    try {
      const card = await this.getCardByIdUseCase.execute(req.params.id);
      if (!card) return res.status(404).json({ error: "Card not found" });
      if (req.user?.role === "Staff" && card.assigned_to_user_id !== req.user.id) {
        return res.status(403).json({ error: "Forbidden" });
      }
      res.json(card);
    } catch (err) {
      console.error("Get Card Error:", err);
      res.status(500).json({ error: "Failed to load card" });
    }
  };

  updateCard = async (req, res) => {
    try {
      const updated = await this.updateCardUseCase.execute(req.params.id, req.body);
      updated ? res.json(updated) : res.status(404).json({ error: "Card not found" });
    } catch (err) {
      console.error("Update Card Error:", err);
      res.status(500).json({ error: "Failed to update card" });
    }
  };

  updateCardActivity = async (req, res) => {
    try {
      const card = await this.getCardByIdUseCase.execute(req.params.id);
      if (!card) return res.status(404).json({ error: "Card not found" });
      if (req.user?.role === "Staff" && card.assigned_to_user_id !== req.user.id) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const updated = await this.updateCardActivityUseCase.execute(req.params.id, req.body);
      updated ? res.json(updated) : res.status(404).json({ error: "Card not found" });
    } catch (err) {
      console.error("Card Activity Error:", err);
      res.status(500).json({ error: "Failed to update card activity" });
    }
  };
}
