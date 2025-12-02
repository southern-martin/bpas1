import express from "express";
import { requireAuth } from "../../../middleware/auth.js";
import { container } from "../../../configuration/container.js";

const router = express.Router();
const controller = container.authController;

router.post("/login", controller.login);
router.get("/me", requireAuth, controller.me);

export default router;
