export class GetProjectCards {
  constructor(cardRepository) {
    this.cardRepository = cardRepository;
  }

  async execute(projectId) {
    return this.cardRepository.findByProjectId(projectId);
  }
}
