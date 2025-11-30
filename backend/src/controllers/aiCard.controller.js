import { bpasAI } from "../ai/bpasAI.js";
import { prisma } from "../db/prisma.js";

export async function prefillCard(req, res) {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  const aiResponse = await bpasAI("prefill", text);
  let parsed;

  try {
    // Some models wrap JSON in code fences; strip them before parsing
    const sanitized = aiResponse
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();
    parsed = JSON.parse(sanitized);
  } catch (err) {
    return res.status(500).json({ error: "AI returned invalid JSON", raw: aiResponse });
  }

  let client = null;
  if (parsed.client) {
    client = await prisma.client.findFirst({
      where: { name: { contains: parsed.client, mode: "insensitive" } }
    });
  }

  let project = null;
  if (parsed.project) {
    project = await prisma.project.findFirst({
      where: { name: { contains: parsed.project, mode: "insensitive" } }
    });
  }

  let staff = null;
  if (parsed.staff) {
    staff = await prisma.user.findFirst({
      where: { name: { contains: parsed.staff, mode: "insensitive" }, role: "Staff" }
    });
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
