import * as clientsService from "../services/clients.service.js";

export async function createClient(req, res) {
  try {
    const client = await clientsService.createClient(req.body);
    res.status(201).json(client);
  } catch (err) {
    console.error("Create Client Error:", err);
    res.status(500).json({ error: "Failed to create client" });
  }
}

export async function getClients(req, res) {
  try {
    const clients = await clientsService.getClients();
    res.json(clients);
  } catch (err) {
    console.error("Get Clients Error:", err);
    res.status(500).json({ error: "Failed to load clients" });
  }
}

export async function getClientById(req, res) {
  try {
    const client = await clientsService.getClientById(req.params.id);
    client ? res.json(client) : res.status(404).json({ error: "Client not found" });
  } catch (err) {
    console.error("Get Client Error:", err);
    res.status(500).json({ error: "Failed to load client" });
  }
}

export async function getClientCards(req, res) {
  try {
    const cards = await clientsService.getClientCards(req.params.id);
    res.json(cards);
  } catch (err) {
    console.error("Get Client Cards Error:", err);
    res.status(500).json({ error: "Failed to load client cards" });
  }
}

export async function updateClient(req, res) {
  try {
    const client = await clientsService.updateClient(req.params.id, req.body);
    client ? res.json(client) : res.status(404).json({ error: "Client not found" });
  } catch (err) {
    console.error("Update Client Error:", err);
    res.status(500).json({ error: "Failed to update client" });
  }
}

export async function deleteClient(req, res) {
  try {
    const client = await clientsService.deleteClient(req.params.id);
    client ? res.json({ success: true }) : res.status(404).json({ error: "Client not found" });
  } catch (err) {
    console.error("Delete Client Error:", err);
    res.status(500).json({ error: "Failed to delete client" });
  }
}
