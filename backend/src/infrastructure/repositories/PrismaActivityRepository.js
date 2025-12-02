import { ActivityRepository } from "../../domain/repositories/ActivityRepository.js";
import { Activity } from "../../domain/entities/Activity.js";

export class PrismaActivityRepository extends ActivityRepository {
  constructor(prismaClient) {
    super();
    this.prisma = prismaClient;
  }

  toDomain(record) {
    if (!record) return null;
    return new Activity({
      id: record.id,
      card_id: record.card_id,
      user_id: record.user_id,
      status_after: record.status_after,
      notes_added: record.notes_added,
      created_at: record.created_at
    });
  }

  async findRecent(limit = 20) {
    const result = await this.prisma.activity.findMany({
      orderBy: { created_at: "desc" },
      take: limit,
      include: { card: true }
    });

    return result.map(a => ({
      id: a.id,
      card_id: a.card_id,
      card_title: a.card?.title || a.card_id,
      action: a.status_after ? `Status → ${a.status_after}` : "Note added",
      created_at: a.created_at
    }));
  }
}
