export class ActivityController {
  constructor({ getRecentActivities }) {
    this.getRecentActivitiesUseCase = getRecentActivities;
  }

  getRecent = async (_req, res) => {
    try {
      const activities = await this.getRecentActivitiesUseCase.execute(20);
      res.json(activities);
    } catch (err) {
      console.error("Get Recent Activities Error:", err);
      res.status(500).json({ error: "Failed to load activities" });
    }
  };
}
