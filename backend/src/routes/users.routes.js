import express from "express";
import * as usersController from "../controllers/users.controller.js";

const router = express.Router();

router.get("/", usersController.getUsers);
router.post("/", usersController.createUser);

export default router;
