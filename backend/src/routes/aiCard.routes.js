import express from "express";
import * as aiCardController from "../controllers/aiCard.controller.js";
import { requireAuth, requireOwner } from "../middleware/auth.js";

const router = express.Router();

router.post("/prefill-card", requireAuth, requireOwner, aiCardController.prefillCard);

export default router;
