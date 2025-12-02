export class UpdateCardActivity {
  constructor(cardRepository) {
    this.cardRepository = cardRepository;
  }

  async execute(id, updates) {
    return this.cardRepository.updateActivity(id, updates);
  }
}
