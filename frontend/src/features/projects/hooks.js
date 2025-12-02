import { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchProjects,
  fetchClients,
  createProject,
  updateProject as updateProjectApi,
  deleteProject as deleteProjectApi,
  fetchProjectById,
  fetchProjectCards
} from "./api.js";

export function useProjectsList() {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [newName, setNewName] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const load = useCallback(async () => {
    const [p, c] = await Promise.all([fetchProjects(), fetchClients()]);
    setProjects(p || []);
    setClients(c || []);
    setPage(1);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(projects.length / pageSize)), [projects.length]);
  const pageData = useMemo(() => projects.slice((page - 1) * pageSize, page * pageSize), [projects, page]);

  const addProject = useCallback(async () => {
    if (!newName.trim() || !selectedClient) return;
    await createProject({ name: newName, client_id: selectedClient });
    setNewName("");
    setSelectedClient("");
    window.__toast?.success?.("Project added");
    load();
  }, [load, newName, selectedClient]);

  const updateProject = useCallback(
    async (id, field, value) => {
      await updateProjectApi(id, { [field]: value });
      window.__toast?.success?.("Project updated");
      load();
    },
    [load]
  );

  const deleteProject = useCallback(
    async id => {
      await deleteProjectApi(id);
      window.__toast?.info?.("Project deleted");
      load();
    },
    [load]
  );

  return {
    state: {
      projects,
      clients,
      newName,
      selectedClient,
      page,
      totalPages,
      pageData
    },
    actions: {
      setNewName,
      setSelectedClient,
      setPage,
      addProject,
      updateProject,
      deleteProject
    }
  };
}

export function useProjectDetails(projectId) {
  const [project, setProject] = useState(null);
  const [client, setClient] = useState(null);
  const [cards, setCards] = useState([]);

  const load = useCallback(async () => {
    const p = await fetchProjectById(projectId);
    const c = await fetchClients();
    const projectClient = (c || []).find(cl => cl.id === p.client_id) || null;
    const cardRes = await fetchProjectCards(projectId);

    setProject(p);
    setClient(projectClient);
    setCards(cardRes || []);
  }, [projectId]);

  useEffect(() => {
    load();
  }, [load]);

  const groupCards = useCallback(status => cards.filter(c => c.status === status), [cards]);

  return { project, client, cards, groupCards };
}
