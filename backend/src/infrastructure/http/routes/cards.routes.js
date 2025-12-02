import express from "express";
import { requireAuth, requireOwner, requireStaff } from "../../../middleware/auth.js";
import { container } from "../../../configuration/container.js";

const router = express.Router();
const controller = container.cardController;

router.post("/", requireAuth, requireOwner, controller.createCard);
router.get("/", requireAuth, controller.getCards);
router.get("/:id", requireAuth, controller.getCardById);
router.patch("/:id", requireAuth, requireOwner, controller.updateCard);
router.post("/:id/updates", requireAuth, requireStaff, controller.updateCardActivity);

export default router;
