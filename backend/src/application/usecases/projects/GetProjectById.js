export class GetProjectById {
  constructor(projectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(id) {
    return this.projectRepository.findById(id);
  }
}
