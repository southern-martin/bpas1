import express from "express";
import * as cardsController from "../controllers/cards.controller.js";

const router = express.Router();

// Create new card
router.post("/", cardsController.createCard);

// Get all cards (with filters)
router.get("/", cardsController.getCards);

// Get single card
router.get("/:id", cardsController.getCardById);

// Update card (owner version)
router.patch("/:id", cardsController.updateCard);

// Staff updates (status + notes)
router.post("/:id/updates", cardsController.updateCardActivity);

export default router;
