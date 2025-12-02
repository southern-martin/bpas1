export class UpdatePlanning {
  constructor(cardRepository) {
    this.cardRepository = cardRepository;
  }

  async execute(cardId, planningBucket) {
    return this.cardRepository.update(cardId, { planning_bucket: planningBucket ?? null });
  }
}
