import { prisma } from "../db/prisma.js";

export async function getPlanning() {
  return {
    tomorrow: await prisma.card.findMany({ where: { planning_bucket: "Tomorrow" } }),
    next_week: await prisma.card.findMany({ where: { planning_bucket: "Next Week" } }),
    later: await prisma.card.findMany({ where: { planning_bucket: "Later" } })
  };
}

export async function updatePlanning(cardId, planningBucket) {
  return prisma.card.update({
    where: { id: cardId },
    data: { planning_bucket: planningBucket }
  });
}
