import express from "express";
import { requireAuth, requireOwner } from "../../../middleware/auth.js";
import { container } from "../../../configuration/container.js";

const router = express.Router();
const controller = container.clientController;

router.post("/", requireAuth, requireOwner, controller.createClient);
router.get("/", requireAuth, requireOwner, controller.getClients);
router.get("/:id", requireAuth, requireOwner, controller.getClientById);
router.get("/:id/cards", requireAuth, requireOwner, controller.getClientCards);
router.put("/:id", requireAuth, requireOwner, controller.updateClient);
router.patch("/:id", requireAuth, requireOwner, controller.updateClient);
router.delete("/:id", requireAuth, requireOwner, controller.deleteClient);

export default router;
