export class UpdateClient {
  constructor(clientRepository) {
    this.clientRepository = clientRepository;
  }

  async execute(id, updates) {
    return this.clientRepository.update(id, updates);
  }
}
