export class Card {
  constructor({
    id,
    title,
    type,
    status,
    linked_client_id = null,
    linked_project_id = null,
    assigned_to_user_id = null,
    notes_raw = null,
    notes_clarified = null,
    event_time = null,
    planning_bucket = null,
    created_at,
    updated_at,
    activities
  }) {
    this.id = id;
    this.title = title;
    this.type = type;
    this.status = status;
    this.linked_client_id = linked_client_id;
    this.linked_project_id = linked_project_id;
    this.assigned_to_user_id = assigned_to_user_id;
    this.notes_raw = notes_raw;
    this.notes_clarified = notes_clarified;
    this.event_time = event_time;
    this.planning_bucket = planning_bucket;
    this.created_at = created_at;
    this.updated_at = updated_at;
    if (activities !== undefined) {
      this.activities = activities;
    }
  }
}
