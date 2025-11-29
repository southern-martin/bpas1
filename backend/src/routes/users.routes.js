import express from "express";
import * as usersController from "../controllers/users.controller.js";
import { requireAuth, requireOwner } from "../middleware/auth.js";

const router = express.Router();

router.get("/", requireAuth, requireOwner, usersController.getUsers);
router.post("/", requireAuth, requireOwner, usersController.createUser);

export default router;
