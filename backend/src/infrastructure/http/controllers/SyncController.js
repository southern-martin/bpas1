export class SyncController {
  constructor({ processSyncQueue }) {
    this.processSyncQueueUseCase = processSyncQueue;
  }

  handleSync = async (req, res) => {
    const items = Array.isArray(req.body?.items) ? req.body.items : [];
    try {
      const result = await this.processSyncQueueUseCase.execute(items);
      if (result.error) {
        return res.status(207).json(result);
      }
      res.json(result);
    } catch (err) {
      console.error("Sync error:", err);
      res.status(500).json({ error: "Sync failed" });
    }
  };
}
