import * as audioService from "../services/audio.service.js";

export async function transcribe(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file uploaded" });
    }

    const text = await audioService.transcribeFile(req.file.path);
    res.json({ raw_text: text });
  } catch (err) {
    console.error("Transcription error:", err);
    res.status(500).json({ error: "Transcription failed" });
  }
}
