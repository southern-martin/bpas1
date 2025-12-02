export class GetRecentActivities {
  constructor(activityRepository) {
    this.activityRepository = activityRepository;
  }

  async execute(limit = 20) {
    return this.activityRepository.findRecent(limit);
  }
}
