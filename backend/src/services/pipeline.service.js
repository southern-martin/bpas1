import { prisma } from "../db/prisma.js";

export async function getPipeline() {
  return {
    to_do: await prisma.card.findMany({ where: { status: "To Do" } }),
    doing: await prisma.card.findMany({ where: { status: "Doing" } }),
    done: await prisma.card.findMany({ where: { status: "Done" } }),
    blocked: await prisma.card.findMany({ where: { status: "Blocked" } })
  };
}
