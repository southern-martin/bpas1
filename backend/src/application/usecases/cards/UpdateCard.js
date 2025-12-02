export class UpdateCard {
  constructor(cardRepository) {
    this.cardRepository = cardRepository;
  }

  async execute(id, updates) {
    return this.cardRepository.update(id, updates);
  }
}
