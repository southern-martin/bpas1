import express from "express";
import * as cardsController from "../controllers/cards.controller.js";
import { requireAuth, requireOwner, requireStaff } from "../middleware/auth.js";

const router = express.Router();

// Create new card
router.post("/", requireAuth, requireOwner, cardsController.createCard);

// Get all cards (with filters)
router.get("/", requireAuth, cardsController.getCards);

// Get single card
router.get("/:id", requireAuth, cardsController.getCardById);

// Update card (owner version)
router.patch("/:id", requireAuth, requireOwner, cardsController.updateCard);

// Staff updates (status + notes)
router.post("/:id/updates", requireAuth, requireStaff, cardsController.updateCardActivity);

export default router;
