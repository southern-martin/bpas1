import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchPlanning, movePlanning } from "./api.js";

export function useOwnerPlanning() {
  const [buckets, setBuckets] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const load = useCallback(async () => {
    const data = await fetchPlanning();
    setBuckets(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const applySearch = useCallback(
    cards => cards.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase())),
    [searchTerm]
  );

  const moveCard = useCallback(
    async (cardId, bucketName) => {
      await movePlanning(cardId, bucketName);
      window.__toast?.success?.(bucketName ? `Moved to ${bucketName}` : "Removed from planning");
      load();
    },
    [load]
  );

  const filteredBuckets = useMemo(() => {
    if (!buckets) return null;
    return {
      tomorrow: applySearch(buckets.tomorrow || []),
      next_week: applySearch(buckets.next_week || []),
      later: applySearch(buckets.later || [])
    };
  }, [applySearch, buckets]);

  return { buckets: filteredBuckets, loading, searchTerm, setSearchTerm, moveCard };
}
