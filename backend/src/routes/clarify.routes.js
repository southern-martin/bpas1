import express from "express";
import * as clarifyController from "../controllers/clarify.controller.js";

const router = express.Router();

router.post("/", clarifyController.handleClarify);

export default router;
