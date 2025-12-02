import express from "express";
import { requireAuth, requireOwner } from "../../../middleware/auth.js";
import { container } from "../../../configuration/container.js";

const router = express.Router();
const controller = container.pipelineController;

router.get("/", requireAuth, requireOwner, controller.getPipeline);

export default router;
