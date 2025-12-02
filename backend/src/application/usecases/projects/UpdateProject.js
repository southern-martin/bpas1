export class UpdateProject {
  constructor(projectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(id, updates) {
    return this.projectRepository.update(id, updates);
  }
}
