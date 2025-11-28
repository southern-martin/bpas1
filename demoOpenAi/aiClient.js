// aiClient.js
import "dotenv/config";
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

const client = new OpenAI({ apiKey });

// Select model based on environment
const isProd = process.env.BPAS_AI_MODE === "prod";
const MODEL = isProd ? "gpt-4o" : "gpt-4o-mini";
// --- Core AI Functions ---
export async function aiRecord(audioText) {
  return await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "user", content: `Convert this speech into clean text:\n${audioText}` }
    ]
  });
}
export async function aiSummarize(text) {
  return await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "user", content: `Summarize clearly and briefly:\n${text}` }
    ]
  });
}
export async function aiClarify(text) {
  return await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "user", content: `Rewrite as a clear instruction with neutral tone:\n${text}` }
    ]
  });
}
export async function aiPrefill(text) {
  return await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "user", content:
        `Extract as JSON:
        - task_or_event
        - client
        - project
        - due_time
        - status
        Text:\n${text}`
      }
    ]
  });
}
