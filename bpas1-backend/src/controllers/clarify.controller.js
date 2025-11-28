import * as clarifyService from "../services/clarify.service.js";

export async function handleClarify(req, res) {
  try {
    const { raw_text } = req.body;

    if (!raw_text) {
      return res.status(400).json({ error: "raw_text is required" });
    }

    const result = await clarifyService.clarifyText(raw_text);

    res.json({ clarified_text: result });
  } catch (err) {
    console.error("Clarify error:", err);
    res.status(500).json({ error: "Clarify failed" });
  }
}
