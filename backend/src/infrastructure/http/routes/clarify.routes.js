import express from "express";
import { container } from "../../../configuration/container.js";

const router = express.Router();
const controller = container.clarifyController;

router.post("/", controller.handleClarify);

export default router;
