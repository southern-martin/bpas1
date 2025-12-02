export class DeleteProject {
  constructor(projectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(id) {
    return this.projectRepository.delete(id);
  }
}
