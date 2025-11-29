import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import dayjs from "dayjs";
import { api } from "../api/client.js";

export default function OwnerCardDetails() {
  const { id } = useParams();
  const [card, setCard] = useState(null);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [status, setStatus] = useState("To Do");
  const clientMap = Object.fromEntries(clients.map(c => [c.id, c.name]));

  const load = useCallback(async () => {
    const res = await api.get(`/cards/${id}`);
    setCard(res.data);
    setStatus(res.data.status);
  }, [id]);

  useEffect(() => {
    load();
    api.get("/clients").then(r => setClients(r.data));
    api.get("/projects").then(r => setProjects(r.data));
    api.get("/users").then(r => {
      const staffOnly = (r.data || []).filter(u => u.role === "Staff");
      setStaffList(staffOnly);
    });
  }, [load, id]);

  if (!card) return <p style={{ padding: 20 }}>Loading…</p>;

  async function updateCard(data) {
    await api.patch(`/cards/${id}`, data);
    const res = await api.get(`/cards/${id}`);
    setCard(res.data);
    setStatus(res.data.status);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>{card.title}</h1>

      <div style={{ marginTop: 10 }}>
        <strong>Status:</strong>
        <select
          style={{ marginLeft: 8 }}
          value={status}
          onChange={e => updateCard({ status: e.target.value })}
        >
          <option>To Do</option>
          <option>Doing</option>
          <option>Done</option>
          <option>Blocked</option>
        </select>
      </div>

      <div style={{ marginTop: 20 }}>
        <h2>Client</h2>
        <div style={{ marginBottom: 6 }}>
          {card.linked_client_id ? (
            <Link to={`/office/client/${card.linked_client_id}`}>
              {clientMap[card.linked_client_id] || card.linked_client_id}
            </Link>
          ) : (
            "None"
          )}
        </div>
        <select
          value={card.linked_client_id || ""}
          onChange={e => updateCard({ linked_client_id: e.target.value || null })}
        >
          <option value="">None</option>
          {clients.map(c => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: 20 }}>
        <h2>Project</h2>
        <select
          value={card.linked_project_id || ""}
          onChange={e => updateCard({ linked_project_id: e.target.value || null })}
        >
          <option value="">None</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: 20 }}>
        <h2>Assigned Staff</h2>
        <select
          className="select-staff"
          value={card.assigned_to_user_id || ""}
          onChange={async e => {
            await api.patch(`/cards/${id}`, { assigned_to_user_id: e.target.value || null });
            load();
          }}
        >
          <option value="">Unassigned</option>
          {staffList.map(s => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>Details</h3>
        <p>Type: {card.type}</p>
        <p>Notes: {card.notes_clarified || card.notes_raw || "—"}</p>
      </div>

      <div style={{ marginTop: 30 }}>
        <h2>Activity Timeline</h2>

        {card.activities?.length === 0 && <p>No activity yet.</p>}

        <div className="timeline">
          {card.activities?.map((act, index) => (
            <div className="timeline-item" key={act.id}>
              <div className="timeline-marker">
                <div className="dot"></div>
                {index !== card.activities.length - 1 && <div className="line"></div>}
              </div>

              <div className="timeline-content">
                <div className="timeline-time">
                  {dayjs(act.created_at).format("MMM D, YYYY — h:mm A")}
                </div>

                {act.status_after && (
                  <div className="timeline-status">
                    <span className="status-pill">{act.status_after}</span>
                    <span>status updated</span>
                  </div>
                )}

                {act.notes_added && (
                  <div className="timeline-note">
                    <span className="note-icon">📝</span> {act.notes_added}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
