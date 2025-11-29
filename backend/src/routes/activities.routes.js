import express from "express";
import { prisma } from "../db/prisma.js";

const router = express.Router();

router.get("/recent", async (req, res) => {
  const result = await prisma.activity.findMany({
    orderBy: { created_at: "desc" },
    take: 20,
    include: { card: true }
  });

  res.json(
    result.map(a => ({
      id: a.id,
      card_id: a.card_id,
      card_title: a.card?.title || a.card_id,
      action: a.status_after ? `Status → ${a.status_after}` : "Note added",
      created_at: a.created_at
    }))
  );
});

export default router;
