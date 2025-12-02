export class CreateClient {
  constructor(clientRepository) {
    this.clientRepository = clientRepository;
  }

  async execute(payload) {
    const { name, phone = null, email = null, address = null, notes = null } = payload;
    return this.clientRepository.create({ name, phone, email, address, notes });
  }
}
