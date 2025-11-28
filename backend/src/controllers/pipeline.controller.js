import * as pipelineService from "../services/pipeline.service.js";

export async function getPipeline(req, res) {
  try {
    const pipeline = await pipelineService.getPipeline();
    res.json(pipeline);
  } catch (err) {
    console.error("Pipeline Error:", err);
    res.status(500).json({ error: "Failed to load pipeline" });
  }
}
