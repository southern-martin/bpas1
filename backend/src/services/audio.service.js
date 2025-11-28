import fs from "fs";
import { aiClient } from "../ai/aiClient.js";

export async function transcribeFile(filePath) {
  let transcript;
  try {
    const fileStream = fs.createReadStream(filePath);
    transcript = await aiClient.audio.transcriptions.create({
      file: fileStream,
      model: "whisper-1"
    });
    return transcript.text;
  } catch (err) {
    console.error("Whisper error:", err);
    throw err;
  } finally {
    fs.unlink(filePath, () => {});
  }
}
