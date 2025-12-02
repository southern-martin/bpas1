import { CardPrefillAI } from "../../domain/services/CardPrefillAI.js";
import { bpasAI } from "../../ai/bpasAI.js";

export class BpasCardPrefillAI extends CardPrefillAI {
  async prefill(text) {
    let aiResponse;
    try {
      aiResponse = await bpasAI("prefill", text);
    } catch (err) {
      const error = new Error("AI prefill call failed");
      error.cause = err;
      error.status = 500;
      throw error;
    }

    const parsed = this.parseJson(aiResponse);
    return parsed;
  }

  parseJson(aiResponse) {
    try {
      const raw = typeof aiResponse === "string" ? aiResponse : JSON.stringify(aiResponse);
      const sanitized = raw.replace(/```json/gi, "").replace(/```/g, "").trim();

      try {
        return JSON.parse(sanitized);
      } catch (err) {
        const start = sanitized.indexOf("{");
        const end = sanitized.lastIndexOf("}");
        if (start !== -1 && end !== -1 && end > start) {
          const candidate = sanitized.slice(start, end + 1);
          return JSON.parse(candidate);
        }
        const error = new Error("AI returned invalid JSON");
        error.raw = aiResponse;
        error.status = 500;
        throw error;
      }
    } catch (err) {
      const error = new Error("AI returned invalid JSON");
      error.raw = aiResponse;
      error.status = err.status || 500;
      throw error;
    }
  }
}
