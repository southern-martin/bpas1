export class Project {
  constructor({ id, name, client_id, created_at }) {
    this.id = id;
    this.name = name;
    this.client_id = client_id;
    this.created_at = created_at;
  }
}
