import { useCallback, useEffect, useMemo, useState } from "react";
import { createCard, fetchCard, prefillCard, updateCard, updatePlanning } from "./api.js";
import { api } from "../../api/client.js";

export function useOwnerCardDetails(cardId) {
  const [card, setCard] = useState(null);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [staff, setStaff] = useState([]);
  const [status, setStatus] = useState("To Do");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!cardId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [cardRes, clientsRes, projectsRes, usersRes] = await Promise.all([
        fetchCard(cardId),
        api.get("/clients").then(r => r.data),
        api.get("/projects").then(r => r.data),
        api.get("/users").then(r => r.data)
      ]);
      setCard(cardRes);
      setStatus(cardRes?.status || "To Do");
      setClients(clientsRes || []);
      setProjects(projectsRes || []);
      setStaff((usersRes || []).filter(u => u.role === "Staff"));
    } catch (err) {
      setError(err);
      setCard(null);
    } finally {
      setLoading(false);
    }
  }, [cardId]);

  useEffect(() => {
    load();
  }, [load]);

  const update = useCallback(
    async patch => {
      if (!cardId) return;
      await updateCard(cardId, patch);
      await load();
    },
    [cardId, load]
  );

  const statusOptions = useMemo(() => ["To Do", "Doing", "Done", "Blocked"], []);

  return {
    card,
    clients,
    projects,
    staff,
    status,
    statusOptions,
    loading,
    error,
    updateStatus: async newStatus => {
      setStatus(newStatus);
      await update({ status: newStatus });
    },
    updateLinkedClient: clientId => update({ linked_client_id: clientId || null }),
    updateLinkedProject: projectId => update({ linked_project_id: projectId || null }),
    updateAssignee: userId => update({ assigned_to_user_id: userId || null })
  };
}

export function useCreateCard(params) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Task");
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [clientId, setClientId] = useState(params?.clientId || "");
  const [projectId, setProjectId] = useState(params?.projectId || "");
  const [assignedTo, setAssignedTo] = useState(params?.assignedTo || "");
  const [eventTime, setEventTime] = useState("");
  const [notes, setNotes] = useState("");
  const [plannedBucket, setPlannedBucket] = useState(params?.plannedBucket || null);
  const [aiText, setAiText] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    async function load() {
      const [c, p, u] = await Promise.all([api.get("/clients"), api.get("/projects"), api.get("/users")]);
      setClients(c.data);
      setProjects(p.data);
      setStaffList((u.data || []).filter(user => user.role === "Staff"));
    }
    load();
  }, []);

  const filteredProjects = useMemo(
    () => (clientId ? projects.filter(p => p.client_id === clientId) : projects),
    [projects, clientId]
  );

  const handleCreate = async () => {
    if (!title.trim()) {
      alert("Title is required.");
      return null;
    }

    const res = await createCard({
      title,
      type,
      linked_client_id: clientId || null,
      linked_project_id: projectId || null,
      assigned_to_user_id: assignedTo || null,
      event_time: type === "Event" ? eventTime || null : null,
      notes_clarified: notes || ""
    });

    const newCardId = res.id;

    if (plannedBucket) {
      await updatePlanning(newCardId, { planning_bucket: plannedBucket });
    }

    return newCardId;
  };

  const handleAIPrefill = async () => {
    if (!aiText.trim()) return;
    setLoadingAI(true);
    try {
      const res = await prefillCard(aiText);
      const data = res.data || {};
      setTitle(data.title || "");
      setType(data.type || "Task");
      if (data.client_id) setClientId(data.client_id);
      if (data.project_id) setProjectId(data.project_id);
      if (data.assigned_to_user_id) setAssignedTo(data.assigned_to_user_id);
      setEventTime(data.event_time || "");
      setNotes(data.notes || "");
      setPlannedBucket(data.planning_bucket || null);
    } finally {
      setLoadingAI(false);
    }
  };

  return {
    state: {
      title,
      type,
      clients,
      projects,
      staffList,
      clientId,
      projectId,
      assignedTo,
      eventTime,
      notes,
      plannedBucket,
      aiText,
      loadingAI,
      filteredProjects
    },
    actions: {
      setTitle,
      setType,
      setClientId,
      setProjectId,
      setAssignedTo,
      setEventTime,
      setNotes,
      setPlannedBucket,
      setAiText,
      handleCreate,
      handleAIPrefill
    }
  };
}
