import fs from "fs";
import { AudioTranscriber } from "../../domain/services/AudioTranscriber.js";
import { aiClient } from "../../ai/aiClient.js";

export class WhisperAudioTranscriber extends AudioTranscriber {
  async transcribe(filePath) {
    let transcript;
    try {
      const fileStream = fs.createReadStream(filePath);
      transcript = await aiClient.audio.transcriptions.create({
        file: fileStream,
        model: "whisper-1"
      });
      return transcript.text;
    } finally {
      fs.unlink(filePath, () => {});
    }
  }
}
