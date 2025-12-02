import express from "express";
import { requireAuth } from "../../../middleware/auth.js";
import { container } from "../../../configuration/container.js";

const router = express.Router();
const controller = container.syncController;

router.post("/", requireAuth, controller.handleSync);

export default router;
