export class GetClientCards {
  constructor(cardRepository) {
    this.cardRepository = cardRepository;
  }

  async execute(clientId) {
    return this.cardRepository.findByClientId(clientId);
  }
}
