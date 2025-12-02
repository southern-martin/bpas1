export class GetClientById {
  constructor(clientRepository) {
    this.clientRepository = clientRepository;
  }

  async execute(id) {
    return this.clientRepository.findById(id);
  }
}
