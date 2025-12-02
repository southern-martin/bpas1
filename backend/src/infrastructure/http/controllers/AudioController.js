export class AudioController {
  constructor({ transcribeAudio }) {
    this.transcribeAudioUseCase = transcribeAudio;
  }

  transcribe = async (req, res) => {
    try {
      const result = await this.transcribeAudioUseCase.execute(req.file?.path);
      res.json({ raw_text: result });
    } catch (err) {
      const status = err.status || 500;
      if (!err.status) console.error("Transcription error:", err);
      res.status(status).json({ error: err.status ? err.message : "Transcription failed" });
    }
  };
}
