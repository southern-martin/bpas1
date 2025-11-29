import express from "express";
import * as projectsController from "../controllers/projects.controller.js";
import { requireAuth, requireOwner } from "../middleware/auth.js";

const router = express.Router();

router.post("/", requireAuth, requireOwner, projectsController.createProject);
router.get("/", requireAuth, requireOwner, projectsController.getProjects);
router.get("/:id", requireAuth, requireOwner, projectsController.getProjectById);
router.get("/:id/cards", requireAuth, requireOwner, projectsController.getProjectCards);
router.patch("/:id", requireAuth, requireOwner, projectsController.updateProject);
router.delete("/:id", requireAuth, requireOwner, projectsController.deleteProject);

export default router;
