import express from "express";
import { requireAuth, requireOwner } from "../../../middleware/auth.js";
import { container } from "../../../configuration/container.js";

const router = express.Router();
const controller = container.aiCardController;

router.post("/prefill-card", requireAuth, requireOwner, controller.prefillCard);

export default router;
