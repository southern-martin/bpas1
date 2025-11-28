import { bpasAI } from "../ai/bpasAI.js";

export async function clarifyText(rawText) {
  const clarified = await bpasAI("clarify", rawText);
  return clarified;
}
