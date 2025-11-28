import * as planningService from "../services/planning.service.js";

export function getPlanning(req, res) {
  try {
    const result = planningService.getPlanning();
    res.json(result);
  } catch (err) {
    console.error("Get Planning Error:", err);
    res.status(500).json({ error: "Failed to load planning" });
  }
}

export function updatePlanning(req, res) {
  try {
    const { planning_bucket } = req.body;
    const updated = planningService.updatePlanning(req.params.id, planning_bucket);
    return updated
      ? res.json(updated)
      : res.status(404).json({ error: "Card not found" });
  } catch (err) {
    console.error("Planning Update Error:", err);
    res.status(500).json({ error: "Failed to update planning bucket" });
  }
}
