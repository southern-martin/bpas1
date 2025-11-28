import express from "express";
import multer from "multer";
import * as audioController from "../controllers/audio.controller.js";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.post("/transcribe", upload.single("audio"), audioController.transcribe);

export default router;
