import express from "express";
import { requireAuth, requireOwner } from "../../../middleware/auth.js";
import { container } from "../../../configuration/container.js";

const router = express.Router();
const controller = container.activityController;

router.get("/recent", requireAuth, requireOwner, controller.getRecent);

export default router;
