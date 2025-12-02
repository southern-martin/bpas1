export class Activity {
  constructor({ id, card_id, user_id, status_after, notes_added, created_at }) {
    this.id = id;
    this.card_id = card_id;
    this.user_id = user_id;
    this.status_after = status_after;
    this.notes_added = notes_added;
    this.created_at = created_at;
  }
}
