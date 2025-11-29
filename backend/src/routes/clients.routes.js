import express from "express";
import * as clientsController from "../controllers/clients.controller.js";

const router = express.Router();

router.post("/", clientsController.createClient);
router.get("/", clientsController.getClients);
router.get("/:id", clientsController.getClientById);
router.get("/:id/cards", clientsController.getClientCards);
router.patch("/:id", clientsController.updateClient);
router.delete("/:id", clientsController.deleteClient);

export default router;
