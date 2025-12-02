import express from "express";
import multer from "multer";
import { container } from "../../../configuration/container.js";

const upload = multer({ dest: "uploads/" });
const router = express.Router();
const controller = container.audioController;

router.post("/transcribe", upload.single("audio"), controller.transcribe);

export default router;
