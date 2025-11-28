import express from "express";
import * as planningController from "../controllers/planning.controller.js";

const router = express.Router();

router.get("/", planningController.getPlanning);
router.patch("/:id", planningController.updatePlanning);

export default router;
