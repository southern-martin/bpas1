export class GetPlanning {
  constructor(cardRepository) {
    this.cardRepository = cardRepository;
  }

  async execute() {
    const [tomorrow, next_week, later] = await Promise.all([
      this.cardRepository.findAll({ planning_bucket: "Tomorrow" }),
      this.cardRepository.findAll({ planning_bucket: "Next Week" }),
      this.cardRepository.findAll({ planning_bucket: "Later" })
    ]);
    return { tomorrow, next_week, later };
  }
}
