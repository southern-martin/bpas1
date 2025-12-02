export class GetCards {
  constructor(cardRepository) {
    this.cardRepository = cardRepository;
  }

  async execute(filters = {}) {
    return this.cardRepository.findAll(filters);
  }
}
