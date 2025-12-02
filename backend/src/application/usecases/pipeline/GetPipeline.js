export class GetPipeline {
  constructor(cardRepository) {
    this.cardRepository = cardRepository;
  }

  async execute() {
    const [to_do, doing, done, blocked] = await Promise.all([
      this.cardRepository.findAll({ status: "To Do" }),
      this.cardRepository.findAll({ status: "Doing" }),
      this.cardRepository.findAll({ status: "Done" }),
      this.cardRepository.findAll({ status: "Blocked" })
    ]);

    return { to_do, doing, done, blocked };
  }
}
