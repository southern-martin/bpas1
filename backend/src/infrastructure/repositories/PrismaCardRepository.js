import { CardRepository } from "../../domain/repositories/CardRepository.js";
import { Card } from "../../domain/entities/Card.js";
import { Activity } from "../../domain/entities/Activity.js";

export class PrismaCardRepository extends CardRepository {
  constructor(prismaClient) {
    super();
    this.prisma = prismaClient;
  }

  toDomain(cardRecord) {
    if (!cardRecord) return null;
    const activities = Array.isArray(cardRecord.activities)
      ? cardRecord.activities.map(activity => new Activity({
          id: activity.id,
          card_id: activity.card_id,
          user_id: activity.user_id,
          status_after: activity.status_after,
          notes_added: activity.notes_added,
          created_at: activity.created_at
        }))
      : undefined;

    return new Card({
      id: cardRecord.id,
      title: cardRecord.title,
      type: cardRecord.type,
      status: cardRecord.status,
      linked_client_id: cardRecord.linked_client_id,
      linked_project_id: cardRecord.linked_project_id,
      assigned_to_user_id: cardRecord.assigned_to_user_id,
      notes_raw: cardRecord.notes_raw,
      notes_clarified: cardRecord.notes_clarified,
      event_time: cardRecord.event_time,
      planning_bucket: cardRecord.planning_bucket,
      created_at: cardRecord.created_at,
      updated_at: cardRecord.updated_at,
      activities
    });
  }

  async create(data) {
    const created = await this.prisma.card.create({
      data: {
        title: data.title,
        type: data.type,
        status: data.status ?? "To Do",
        linked_client_id: data.linked_client_id ?? null,
        linked_project_id: data.linked_project_id ?? null,
        assigned_to_user_id: data.assigned_to_user_id ?? null,
        notes_raw: data.notes_raw ?? "",
        notes_clarified: data.notes_clarified ?? "",
        event_time: data.event_time ?? null,
        planning_bucket: data.planning_bucket ?? null
      }
    });
    return this.toDomain(created);
  }

  async findAll(filters = {}) {
    const cards = await this.prisma.card.findMany({
      where: {
        assigned_to_user_id: filters.assigned_to ?? undefined,
        linked_client_id: filters.client_id ?? undefined,
        linked_project_id: filters.project_id ?? undefined,
        status: filters.status ?? undefined,
        type: filters.type ?? undefined
      }
    });
    return cards.map(c => this.toDomain(c));
  }

  async findById(id) {
    const card = await this.prisma.card.findUnique({
      where: { id },
      include: { activities: true }
    });
    return this.toDomain(card);
  }

  async update(id, updates) {
    const updated = await this.prisma.card.update({
      where: { id },
      data: updates
    });
    return this.toDomain(updated);
  }

  async updateActivity(id, updates) {
    const updatedCard = await this.prisma.card.update({
      where: { id },
      data: {
        status: updates.status ?? undefined,
        notes_clarified: updates.notes_clarified ?? undefined
      }
    });

    await this.prisma.activity.create({
      data: {
        card_id: id,
        user_id: updates.user_id ?? null,
        status_after: updates.status ?? null,
        notes_added: updates.notes_clarified ?? null
      }
    });

    return this.toDomain(updatedCard);
  }

  async findByClientId(clientId) {
    const cards = await this.prisma.card.findMany({
      where: { linked_client_id: clientId },
      orderBy: { created_at: "desc" }
    });
    return cards.map(card => this.toDomain(card));
  }

  async findByProjectId(projectId) {
    const cards = await this.prisma.card.findMany({
      where: { linked_project_id: projectId },
      orderBy: { created_at: "desc" }
    });
    return cards.map(card => this.toDomain(card));
  }
}
