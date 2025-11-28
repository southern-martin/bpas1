import { aiRecord, aiSummarize, aiClarify, aiPrefill } from "./aiClient.js";

export async function bpasAI(action, payload) {
  switch (action) {
    case "record":
      return (await aiRecord(payload)).choices[0].message.content;
    case "summarize":
      return (await aiSummarize(payload)).choices[0].message.content;
    case "clarify":
      return (await aiClarify(payload)).choices[0].message.content;
    case "prefill":
      return (await aiPrefill(payload)).choices[0].message.content;
    default:
      throw new Error(`Unknown AI action: ${action}`);
  }
}
