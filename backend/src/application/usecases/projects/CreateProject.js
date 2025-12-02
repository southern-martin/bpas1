export class CreateProject {
  constructor(projectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(payload) {
    return this.projectRepository.create({
      name: payload.name,
      client_id: payload.client_id
    });
  }
}
