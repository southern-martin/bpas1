import express from "express";
import * as pipelineController from "../controllers/pipeline.controller.js";

const router = express.Router();

router.get("/", pipelineController.getPipeline);

export default router;
