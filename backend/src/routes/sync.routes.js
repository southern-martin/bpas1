import express from "express";
import * as syncController from "../controllers/sync.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Bulk sync offline queue items
router.post("/", requireAuth, syncController.handleSync);

export default router;
