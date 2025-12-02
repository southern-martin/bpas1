export class GetProjects {
  constructor(projectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute() {
    return this.projectRepository.findAll();
  }
}
