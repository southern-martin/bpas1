import { useEffect, useState } from "react";
import { useParams, useNavigate, Link, Navigate } from "react-router-dom";
import { api } from "../api/client.js";

export default function ProjectView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [client, setClient] = useState(null);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    load();
  }, [id]);

  async function load() {
    const p = await api.get(`/projects/${id}`);
    const c = await api.get(`/clients/${p.data.client_id}`);
    const cardRes = await api.get(`/projects/${id}/cards`);

    setProject(p.data);
    setClient(c.data);
    setCards(cardRes.data);
  }

  function groupCards(status) {
    return cards.filter(c => c.status === status);
  }

  if (localStorage.getItem("role") !== "Owner") {
    return <Navigate to="/login" replace />;
  }

  if (!project) return <p className="page">Loading…</p>;

  return (
    <div className="page">
      <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0 }}>{project.name}</h1>
          <p className="small" style={{ margin: 0 }}>
            Linked to client {client ? client.name : "Loading..."}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => navigate(-1)} className="btn btn-light">
            ← Back
          </button>
          <button
            className="btn btn-primary"
            onClick={() =>
              navigate(
                `/office/create-card?project=${project.id}&client=${project.client_id}`
              )
            }
          >
            + Create Card
          </button>
        </div>
      </div>

      <div className="card">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: 12 }}>
          <InfoItem label="Client" value={client ? <Link to={`/office/client/${client.id}`}>{client.name}</Link> : "Loading..."} />
          <InfoItem label="Created" value={project.created_at ? new Date(project.created_at).toLocaleDateString() : "—"} />
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>{cards.length} card(s)</h2>
        <div className="pipeline-grid" style={{ marginTop: 12 }}>
          <CardColumn title="To Do" cards={groupCards("To Do")} navigate={navigate} />
          <CardColumn title="Doing" cards={groupCards("Doing")} navigate={navigate} />
          <CardColumn title="Done" cards={groupCards("Done")} navigate={navigate} />
          <CardColumn title="Blocked" cards={groupCards("Blocked")} navigate={navigate} />
        </div>
      </div>
    </div>
  );
}

function CardColumn({ title, cards, navigate }) {
  return (
    <div className="pipeline-column">
      <h2>{title}</h2>

      {cards.length === 0 && <p className="small">None</p>}

      {cards.map(card => (
        <div
          key={card.id}
          className="pipeline-card"
          onClick={() => navigate(`/office/card/${card.id}`)}
          style={{ cursor: "pointer" }}
        >
          <div className="card-title">{card.title}</div>
          <div className="card-subtitle">
            {card.type} • status {card.status}
          </div>
        </div>
      ))}
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div style={{ padding: 10, border: "1px solid var(--border)", borderRadius: "10px", background: "white" }}>
      <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 15, color: "#0f172a" }}>{value || "—"}</div>
    </div>
  );
}
