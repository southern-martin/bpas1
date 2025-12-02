import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchPipeline, fetchClients, fetchProjects, updateCardStatus } from "./api.js";

const statusMap = {
  "todo-col": "To Do",
  "doing-col": "Doing",
  "done-col": "Done",
  "blocked-col": "Blocked"
};

export function usePipelineBoard() {
  const [pipeline, setPipeline] = useState({ to_do: [], doing: [], done: [], blocked: [] });
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [clientFilter, setClientFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const load = useCallback(async () => {
    const [pipe, c, p] = await Promise.all([fetchPipeline(), fetchClients(), fetchProjects()]);
    setPipeline(pipe);
    setClients(c);
    setProjects(p);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDragEnd = useCallback(
    async result => {
      const { destination, source, draggableId } = result;
      if (!destination) return;
      if (destination.droppableId === source.droppableId && destination.index === source.index) return;
      const newStatus = statusMap[destination.droppableId];
      try {
        await updateCardStatus(draggableId, newStatus);
        window.__toast?.success?.(`Moved to ${newStatus}`);
        await load();
      } catch (err) {
        window.__toast?.error?.("Move failed");
      }
    },
    [load]
  );

  const filterCards = useCallback(
    cards =>
      cards.filter(card => {
        if (clientFilter && card.linked_client_id !== clientFilter) return false;
        if (projectFilter && card.linked_project_id !== projectFilter) return false;
        if (searchTerm && !card.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
      }),
    [clientFilter, projectFilter, searchTerm]
  );

  const filteredPipeline = useMemo(
    () => ({
      to_do: filterCards(pipeline.to_do || []),
      doing: filterCards(pipeline.doing || []),
      done: filterCards(pipeline.done || []),
      blocked: filterCards(pipeline.blocked || [])
    }),
    [filterCards, pipeline]
  );

  const clearFilters = useCallback(() => {
    setClientFilter("");
    setProjectFilter("");
    setSearchTerm("");
  }, []);

  return {
    state: {
      pipeline: filteredPipeline,
      clients,
      projects,
      clientFilter,
      projectFilter,
      searchTerm
    },
    actions: {
      setClientFilter,
      setProjectFilter,
      setSearchTerm,
      clearFilters,
      handleDragEnd
    }
  };
}
