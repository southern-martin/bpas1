export class ClientController {
  constructor({ createClient, getClients, getClientById, getClientCards, updateClient, deleteClient }) {
    this.createClientUseCase = createClient;
    this.getClientsUseCase = getClients;
    this.getClientByIdUseCase = getClientById;
    this.getClientCardsUseCase = getClientCards;
    this.updateClientUseCase = updateClient;
    this.deleteClientUseCase = deleteClient;
  }

  createClient = async (req, res) => {
    try {
      const client = await this.createClientUseCase.execute(req.body);
      res.status(201).json(client);
    } catch (err) {
      console.error("Create Client Error:", err);
      res.status(500).json({ error: "Failed to create client" });
    }
  };

  getClients = async (_req, res) => {
    try {
      const clients = await this.getClientsUseCase.execute();
      res.json(clients);
    } catch (err) {
      console.error("Get Clients Error:", err);
      res.status(500).json({ error: "Failed to load clients" });
    }
  };

  getClientById = async (req, res) => {
    try {
      const client = await this.getClientByIdUseCase.execute(req.params.id);
      client ? res.json(client) : res.status(404).json({ error: "Client not found" });
    } catch (err) {
      console.error("Get Client Error:", err);
      res.status(500).json({ error: "Failed to load client" });
    }
  };

  getClientCards = async (req, res) => {
    try {
      const cards = await this.getClientCardsUseCase.execute(req.params.id);
      res.json(cards);
    } catch (err) {
      console.error("Get Client Cards Error:", err);
      res.status(500).json({ error: "Failed to load client cards" });
    }
  };

  updateClient = async (req, res) => {
    try {
      const client = await this.updateClientUseCase.execute(req.params.id, req.body);
      client ? res.json(client) : res.status(404).json({ error: "Client not found" });
    } catch (err) {
      console.error("Update Client Error:", err);
      res.status(500).json({ error: "Failed to update client" });
    }
  };

  deleteClient = async (req, res) => {
    try {
      const deleted = await this.deleteClientUseCase.execute(req.params.id);
      deleted ? res.json({ success: true }) : res.status(404).json({ error: "Client not found" });
    } catch (err) {
      console.error("Delete Client Error:", err);
      res.status(500).json({ error: "Failed to delete client" });
    }
  };
}
