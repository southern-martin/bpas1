export class PlanningController {
  constructor({ getPlanning, updatePlanning }) {
    this.getPlanningUseCase = getPlanning;
    this.updatePlanningUseCase = updatePlanning;
  }

  getPlanning = async (_req, res) => {
    try {
      const result = await this.getPlanningUseCase.execute();
      res.json(result);
    } catch (err) {
      console.error("Get Planning Error:", err);
      res.status(500).json({ error: "Failed to load planning" });
    }
  };

  updatePlanning = async (req, res) => {
    try {
      const { planning_bucket } = req.body;
      const updated = await this.updatePlanningUseCase.execute(req.params.id, planning_bucket);
      return updated ? res.json(updated) : res.status(404).json({ error: "Card not found" });
    } catch (err) {
      console.error("Planning Update Error:", err);
      res.status(500).json({ error: "Failed to update planning bucket" });
    }
  };
}
