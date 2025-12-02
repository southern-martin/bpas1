export class GetCardById {
  constructor(cardRepository) {
    this.cardRepository = cardRepository;
  }

  async execute(id) {
    return this.cardRepository.findById(id);
  }
}
