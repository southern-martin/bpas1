import "dotenv/config";
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

export const aiClient = new OpenAI({ apiKey });

export async function aiClarify(text) {
  return await aiClient.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: `Clarify:\n${text}` }],
  });
}

export async function aiSummarize(text) {
  return await aiClient.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: `Summarize this:\n${text}` }],
  });
}

export async function aiRecord(audioText) {
  return await aiClient.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: `Convert speech to text:\n${audioText}` }],
  });
}

export async function aiPrefill(text) {
  return await aiClient.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: `Extract task info as JSON:\n${text}`,
      },
    ],
  });
}
