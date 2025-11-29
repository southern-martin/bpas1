import express from "express";
import * as pipelineController from "../controllers/pipeline.controller.js";
import { requireAuth, requireOwner } from "../middleware/auth.js";

const router = express.Router();

router.get("/", requireAuth, requireOwner, pipelineController.getPipeline);

export default router;
