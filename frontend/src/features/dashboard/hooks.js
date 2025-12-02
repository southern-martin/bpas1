import { useCallback, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { fetchCards, fetchRecentActivities } from "./api.js";

export function useOwnerDashboard() {
  const [cards, setCards] = useState([]);
  const [activities, setActivities] = useState([]);

  const load = useCallback(async () => {
    const [cardList, activityList] = await Promise.all([fetchCards(), fetchRecentActivities()]);
    setCards(cardList);
    setActivities(activityList);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const count = useCallback(status => cards.filter(c => c.status === status).length, [cards]);

  const todayEvents = useMemo(
    () => cards.filter(c => c.type === "Event" && c.event_time && dayjs(c.event_time).isSame(dayjs(), "day")),
    [cards]
  );

  const staffMap = useMemo(() => {
    const map = {};
    cards.forEach(c => {
      if (!c.assigned_to_user_id) return;
      map[c.assigned_to_user_id] = (map[c.assigned_to_user_id] || 0) + 1;
    });
    return map;
  }, [cards]);

  return { cards, activities, count, todayEvents, staffMap };
}
