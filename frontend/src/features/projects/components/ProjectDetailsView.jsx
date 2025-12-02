import { Link } from "react-router-dom";

export function ProjectDetailsView({ project, client, cards, groupCards, onBack, onCreateCard }) {
  if (!project) return <p className="page">Loading…</p>;

  return (
    <div className="page">
      <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0 }}>{project.name}</h1>
          <p className="small" style={{ margin: 0 }}>
            Linked to client {client ? <Link to={`/office/client/${client.id}`}>{client.name}</Link> : "Loading..."}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onBack} className="btn btn-light">
            ← Back
          </button>
          <button className="btn btn-primary" onClick={onCreateCard}>
            + Create Card
          </button>
        </div>
      </div>

      <div className="card">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: 12 }}>
          <InfoItem
            label="Client"
            value={client ? <Link to={`/office/client/${client.id}`}>{client.name}</Link> : "Loading..."}
          />
          <InfoItem
            label="Created"
            value={project.created_at ? new Date(project.created_at).toLocaleDateString() : "—"}
          />
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>{cards.length} card(s)</h2>
        <div className="pipeline-grid" style={{ marginTop: 12 }}>
          <CardColumn title="To Do" cards={groupCards("To Do")} />
          <CardColumn title="Doing" cards={groupCards("Doing")} />
          <CardColumn title="Done" cards={groupCards("Done")} />
          <CardColumn title="Blocked" cards={groupCards("Blocked")} />
        </div>
      </div>
    </div>
  );
}

function CardColumn({ title, cards }) {
  return (
    <div className="pipeline-column">
      <h2>{title}</h2>

      {cards.length === 0 && <p className="small">None</p>}

      {cards.map(card => (
        <div
          key={card.id}
          className="pipeline-card"
          onClick={() => (window.location.href = `/office/card/${card.id}`)}
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
