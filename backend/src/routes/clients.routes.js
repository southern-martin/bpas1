import express from "express";
import * as clientsController from "../controllers/clients.controller.js";
import { requireAuth, requireOwner } from "../middleware/auth.js";

const router = express.Router();

router.post("/", requireAuth, requireOwner, clientsController.createClient);
router.get("/", requireAuth, requireOwner, clientsController.getClients);
router.get("/:id", requireAuth, requireOwner, clientsController.getClientById);
router.get("/:id/cards", requireAuth, requireOwner, clientsController.getClientCards);
router.patch("/:id", requireAuth, requireOwner, clientsController.updateClient);
router.delete("/:id", requireAuth, requireOwner, clientsController.deleteClient);

export default router;
