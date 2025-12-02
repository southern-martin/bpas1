export class ProcessSyncQueue {
  constructor({ createCard, updateCard, updateCardActivity }) {
    this.createCardUseCase = createCard;
    this.updateCardUseCase = updateCard;
    this.updateCardActivityUseCase = updateCardActivity;
  }

  async execute(items = []) {
    if (!Array.isArray(items) || items.length === 0) {
      return { synced: 0 };
    }

    let synced = 0;
    for (const item of items) {
      try {
        await this.replayItem(item);
        synced += 1;
      } catch (err) {
        return {
          synced,
          error: `Failed on item ${item?.id || "unknown"}`
        };
      }
    }

    return { synced };
  }

  async replayItem(item) {
    switch (item?.type) {
      case "card-update":
        await this.updateCardUseCase.execute(item.payload.id, item.payload.body);
        return;
      case "card-create":
        await this.createCardUseCase.execute(item.payload.body);
        return;
      case "activity":
        await this.updateCardActivityUseCase.execute(item.payload.cardId, item.payload.body);
        return;
      default:
        throw new Error("Unknown sync item type");
    }
  }
}
