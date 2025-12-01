import { useEffect, useMemo, useState } from "react";
import { useNavigate, Navigate, useSearchParams } from "react-router-dom";
import { api } from "../api/client.js";

export default function CreateCard() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [title, setTitle] = useState("");
  const [type, setType] = useState("Task");
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [clientId, setClientId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [notes, setNotes] = useState("");
  const [plannedBucket, setPlannedBucket] = useState(null);
  const [aiText, setAiText] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    async function load() {
      const [c, p, u] = await Promise.all([
        api.get("/clients"),
        api.get("/projects"),
        api.get("/users")
      ]);
      setClients(c.data);
      setProjects(p.data);
      setStaffList((u.data || []).filter(user => user.role === "Staff"));
    }
    load();
  }, []);

  useEffect(() => {
    const clientFromURL = params.get("client");
    const projectFromURL = params.get("project");
    const statusFromURL = params.get("status");
    const bucketFromURL = params.get("bucket");
    const staffFromURL = params.get("staff");

    if (clientFromURL) setClientId(clientFromURL);
    if (projectFromURL) setProjectId(projectFromURL);
    if (statusFromURL) setType(statusFromURL);
    if (bucketFromURL) setPlannedBucket(bucketFromURL);
    if (staffFromURL) setAssignedTo(staffFromURL);
  }, [params]);

  const filteredProjects = useMemo(
    () => (clientId ? projects.filter(p => p.client_id === clientId) : projects),
    [projects, clientId]
  );

  async function handleCreate() {
    if (!title.trim()) {
      alert("Title is required.");
      return;
    }

    const res = await api.post("/cards", {
      title,
      type,
      linked_client_id: clientId || null,
      linked_project_id: projectId || null,
      assigned_to_user_id: assignedTo || null,
      event_time: type === "Event" ? eventTime || null : null,
      notes_clarified: notes || ""
    });

    const newCardId = res.data.id;

    if (plannedBucket) {
      await api.patch(`/planning/${newCardId}`, {
        planning_bucket: plannedBucket
      });
    }

    navigate(`/office/card/${newCardId}`);
  }

  async function handleAIPrefill() {
    if (!aiText.trim()) return;
    setLoadingAI(true);
    try {
      const res = await api.post("/ai/prefill-card", { text: aiText });
      const data = res.data || {};
      setTitle(data.title || "");
      setType(data.type || "Task");
      if (data.client_id) setClientId(data.client_id);
      if (data.project_id) setProjectId(data.project_id);
      if (data.assigned_to_user_id) setAssignedTo(data.assigned_to_user_id);
      setEventTime(data.event_time || "");
      setNotes(data.notes || "");
      setPlannedBucket(data.planning_bucket || null);
    } catch (err) {
      console.error("AI prefill error", err);
      alert("AI prefill failed");
    } finally {
      setLoadingAI(false);
    }
  }

  if (localStorage.getItem("role") !== "Owner") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="page">
      <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => navigate(-1)} className="btn btn-light">
          ← Back
        </button>
        <h1 style={{ margin: 0 }}>Create New Card</h1>
        <div />
      </div>

      <div className="card ai-box">
        <h2 style={{ marginTop: 0 }}>AI Create (Optional)</h2>
        <textarea
          className="ai-input"
          placeholder="Describe the task or event..."
          value={aiText}
          onChange={e => setAiText(e.target.value)}
        />
        <button className="ai-btn" onClick={handleAIPrefill} disabled={loadingAI}>
          {loadingAI ? "Thinking..." : "✨ AI Prefill"}
        </button>
      </div>

      <div className="card" style={{ display: "grid", gap: 12 }}>
        <label>
          Card Type
          <select value={type} onChange={e => setType(e.target.value)} style={{ display: "block", marginTop: 6 }}>
            <option value="Task">Task</option>
            <option value="Event">Event</option>
          </select>
        </label>

        <label>
          Title
          <input
            style={{ width: "100%", padding: 10, marginTop: 6 }}
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Card title"
          />
        </label>

        <label>
          Client
          <select
            value={clientId}
            onChange={e => {
              setClientId(e.target.value);
              setProjectId("");
            }}
            style={{ display: "block", marginTop: 6 }}
          >
            <option value="">None</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Project
          <select
            value={projectId}
            onChange={e => setProjectId(e.target.value)}
            style={{ display: "block", marginTop: 6 }}
          >
            <option value="">None</option>
            {filteredProjects.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Assigned To
          <select
            value={assignedTo}
            onChange={e => setAssignedTo(e.target.value)}
            style={{ display: "block", marginTop: 6 }}
          >
            <option value="">Unassigned</option>
            {staffList.map(s => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>

        {type === "Event" && (
          <label>
            Event Time
            <input
              type="datetime-local"
              value={eventTime}
              onChange={e => setEventTime(e.target.value)}
              style={{ display: "block", marginTop: 6 }}
            />
          </label>
        )}

        <label>
          Notes (optional)
          <textarea
            style={{ width: "100%", height: 100, marginTop: 6 }}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Add quick notes"
          />
        </label>
      </div>

      <div className="card" style={{ textAlign: "right" }}>
        <button
          onClick={handleCreate}
          className="btn btn-primary"
          style={{ paddingLeft: 20, paddingRight: 20 }}
        >
          Create Card
        </button>
      </div>
    </div>
  );
}
