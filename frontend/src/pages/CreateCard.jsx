import { useNavigate, Navigate, useSearchParams } from "react-router-dom";
import { useToast } from "../components/ToastProvider.jsx";
import { useCreateCard } from "../features/cards/index.js";

export default function CreateCard() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const toast = useToast();

  const urlParams = {
    clientId: params.get("client") || "",
    projectId: params.get("project") || "",
    plannedBucket: params.get("bucket") || null,
    assignedTo: params.get("staff") || ""
  };

  const {
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
  } = useCreateCard(urlParams);

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
          className="btn btn-primary"
          style={{ paddingLeft: 20, paddingRight: 20 }}
          onClick={async () => {
            const newCardId = await handleCreate();
            if (newCardId) {
              toast.success("Card created");
              navigate(`/office/card/${newCardId}`);
            }
          }}
        >
          Create Card
        </button>
      </div>
    </div>
  );
}
