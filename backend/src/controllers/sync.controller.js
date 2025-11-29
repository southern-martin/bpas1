import * as cardsService from "../services/cards.service.js";

// Accepts array of queue items and replays them server-side
export async function handleSync(req, res) {
  const items = Array.isArray(req.body?.items) ? req.body.items : [];

  if (!items.length) {
    return res.json({ synced: 0 });
  }

  let synced = 0;
  for (const item of items) {
    try {
      await replayItem(item);
      synced += 1;
    } catch (err) {
      // stop at first failure so client can retry remaining
      return res.status(207).json({
        synced,
        error: `Failed on item ${item?.id || "unknown"}`,
      });
    }
  }

  res.json({ synced });
}

async function replayItem(item) {
  switch (item.type) {
    case "card-update":
      await cardsService.updateCard(item.payload.id, item.payload.body);
      return;
    case "card-create":
      await cardsService.createCard(item.payload.body);
      return;
    case "activity":
      await cardsService.updateCardActivity(
        item.payload.cardId,
        item.payload.body
      );
      return;
    default:
      throw new Error("Unknown sync item type");
  }
}
