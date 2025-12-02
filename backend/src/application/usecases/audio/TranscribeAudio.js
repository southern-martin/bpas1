export class TranscribeAudio {
  constructor(audioTranscriber) {
    this.audioTranscriber = audioTranscriber;
  }

  async execute(filePath) {
    if (!filePath) {
      const err = new Error("No audio file uploaded");
      err.status = 400;
      throw err;
    }
    return this.audioTranscriber.transcribe(filePath);
  }
}
