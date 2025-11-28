import { bpasAI } from "../ai/bpasAI.js";

export async function clarify(raw) {
  const clarified = await bpasAI("clarify", raw);
  return {
    clarified_text: clarified,
    detected_type: null,
    detected_client: null,
    detected_project: null,
    detected_time: null
  };
}
