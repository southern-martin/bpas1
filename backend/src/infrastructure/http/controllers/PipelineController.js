export class PipelineController {
  constructor({ getPipeline }) {
    this.getPipelineUseCase = getPipeline;
  }

  getPipeline = async (_req, res) => {
    try {
      const pipeline = await this.getPipelineUseCase.execute();
      res.json(pipeline);
    } catch (err) {
      console.error("Pipeline Error:", err);
      res.status(500).json({ error: "Failed to load pipeline" });
    }
  };
}
