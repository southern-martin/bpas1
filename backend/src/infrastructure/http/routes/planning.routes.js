import express from "express";
import { requireAuth, requireOwner } from "../../../middleware/auth.js";
import { container } from "../../../configuration/container.js";

const router = express.Router();
const controller = container.planningController;

router.get("/", requireAuth, requireOwner, controller.getPlanning);
router.patch("/:id", requireAuth, requireOwner, controller.updatePlanning);

export default router;
