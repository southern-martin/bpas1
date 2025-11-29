import express from "express";
import * as projectsController from "../controllers/projects.controller.js";

const router = express.Router();

router.post("/", projectsController.createProject);
router.get("/", projectsController.getProjects);
router.get("/:id", projectsController.getProjectById);
router.get("/:id/cards", projectsController.getProjectCards);
router.patch("/:id", projectsController.updateProject);
router.delete("/:id", projectsController.deleteProject);

export default router;
