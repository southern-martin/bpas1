export class PrefillCard {
  constructor({ cardPrefillAI, clientRepository, projectRepository, userRepository }) {
    this.cardPrefillAI = cardPrefillAI;
    this.clientRepository = clientRepository;
    this.projectRepository = projectRepository;
    this.userRepository = userRepository;
  }

  async execute(text) {
    if (!text) {
      const err = new Error("Text is required");
      err.status = 400;
      throw err;
    }

    const parsed = await this.cardPrefillAI.prefill(text);

    const clients = await this.clientRepository.findAll();
    const clientMatch = parsed.client
      ? this.findByName(clients, parsed.client)
      : null;

    const projects = await this.projectRepository.findAll();
    const projectMatch = parsed.project
      ? this.findByName(projects, parsed.project)
      : null;

    const users = await this.userRepository.findAll();
    const staffMatch = parsed.staff
      ? this.findByName(users.filter(u => u.role === "Staff"), parsed.staff)
      : null;

    return {
      title: parsed.title || "",
      type: parsed.type || "Task",
      client_id: clientMatch ? clientMatch.id : null,
      project_id: projectMatch ? projectMatch.id : null,
      assigned_to_user_id: staffMatch ? staffMatch.id : null,
      event_time: parsed.time || null,
      status: parsed.status || "To Do",
      planning_bucket: parsed.planning || null,
      notes: parsed.notes || ""
    };
  }

  findByName(items, needle) {
    const value = needle.toLowerCase().trim();
    return items.find(item => (item.name || "").toLowerCase().includes(value)) || null;
  }
}
