import express from "express";
import * as planningController from "../controllers/planning.controller.js";
import { requireAuth, requireOwner } from "../middleware/auth.js";

const router = express.Router();

router.get("/", requireAuth, requireOwner, planningController.getPlanning);
router.patch("/:id", requireAuth, requireOwner, planningController.updatePlanning);

export default router;
