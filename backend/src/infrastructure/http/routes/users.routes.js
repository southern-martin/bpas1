import express from "express";
import { requireAuth, requireOwner } from "../../../middleware/auth.js";
import { container } from "../../../configuration/container.js";

const router = express.Router();
const controller = container.userController;

router.get("/", requireAuth, requireOwner, controller.getUsers);
router.post("/", requireAuth, requireOwner, controller.createUser);

export default router;
