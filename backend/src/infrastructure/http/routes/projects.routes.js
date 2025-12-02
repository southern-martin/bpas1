import express from "express";
import { requireAuth, requireOwner } from "../../../middleware/auth.js";
import { container } from "../../../configuration/container.js";

const router = express.Router();
const controller = container.projectController;

router.post("/", requireAuth, requireOwner, controller.createProject);
router.get("/", requireAuth, requireOwner, controller.getProjects);
router.get("/:id", requireAuth, requireOwner, controller.getProjectById);
router.get("/:id/cards", requireAuth, requireOwner, controller.getProjectCards);
router.patch("/:id", requireAuth, requireOwner, controller.updateProject);
router.delete("/:id", requireAuth, requireOwner, controller.deleteProject);

export default router;
