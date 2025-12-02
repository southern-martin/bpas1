export class CreateCard {
  constructor(cardRepository) {
    this.cardRepository = cardRepository;
  }

  async execute(payload) {
    return this.cardRepository.create({
      title: payload.title,
      type: payload.type,
      status: "To Do",
      linked_client_id: payload.linked_client_id ?? null,
      linked_project_id: payload.linked_project_id ?? null,
      assigned_to_user_id: payload.assigned_to_user_id ?? null,
      notes_raw: payload.notes_raw ?? "",
      notes_clarified: payload.notes_clarified ?? "",
      event_time: payload.event_time ?? null,
      planning_bucket: payload.planning_bucket ?? null
    });
  }
}
