export class GetClients {
  constructor(clientRepository) {
    this.clientRepository = clientRepository;
  }

  async execute() {
    return this.clientRepository.findAll();
  }
}
