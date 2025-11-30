import { bpasAI } from "../ai/bpasAI.js";
import { prisma } from "../db/prisma.js";

export async function prefillCard(req, res) {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  let aiResponse;
  try {
    aiResponse = await bpasAI("prefill", text);
  } catch (err) {
    console.error("AI prefill call failed", err);
    return res.status(500).json({ error: "AI prefill call failed" });
  }
  let parsed;

  try {
    // Ensure string and strip code fences
    const raw =
      typeof aiResponse === "string" ? aiResponse : JSON.stringify(aiResponse);
    const sanitized = raw
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    try {
      parsed = JSON.parse(sanitized);
    } catch (err) {
      // Fallback: try to parse substring between first { and last }
      const start = sanitized.indexOf("{");
      const end = sanitized.lastIndexOf("}");
      if (start !== -1 && end !== -1 && end > start) {
        const candidate = sanitized.slice(start, end + 1);
        parsed = JSON.parse(candidate);
      } else {
        console.error("AI prefill parse failed (no JSON block found)", {
          raw: aiResponse
        });
        throw err;
      }
    }
  } catch (err) {
    console.error("AI prefill parse error", { raw: aiResponse, err });
    return res.status(500).json({ error: "AI returned invalid JSON", raw: aiResponse });
  }

  let client = null;
  if (parsed.client) {
    const needle = parsed.client.toLowerCase().trim();
    const candidates = await prisma.client.findMany();
    client = candidates.find(c => (c.name || "").toLowerCase().includes(needle)) || null;
  }

  let project = null;
  if (parsed.project) {
    const needle = parsed.project.toLowerCase().trim();
    const candidates = await prisma.project.findMany();
    project = candidates.find(p => (p.name || "").toLowerCase().includes(needle)) || null;
  }

  let staff = null;
  if (parsed.staff) {
    const needle = parsed.staff.toLowerCase().trim();
    const candidates = await prisma.user.findMany({ where: { role: "Staff" } });
    staff = candidates.find(u => (u.name || "").toLowerCase().includes(needle)) || null;
  }

  res.json({
    title: parsed.title || "",
    type: parsed.type || "Task",
    client_id: client ? client.id : null,
    project_id: project ? project.id : null,
    assigned_to_user_id: staff ? staff.id : null,
    event_time: parsed.time || null,
    status: parsed.status || "To Do",
    planning_bucket: parsed.planning || null,
    notes: parsed.notes || ""
  });
}
