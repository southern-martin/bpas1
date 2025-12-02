export class Client {
  constructor({ id, name, phone = null, email = null, address = null, notes = null, created_at, projects }) {
    this.id = id;
    this.name = name;
    this.phone = phone;
    this.email = email;
    this.address = address;
    this.notes = notes;
    this.created_at = created_at;
    if (projects !== undefined) {
      this.projects = projects;
    }
  }
}
