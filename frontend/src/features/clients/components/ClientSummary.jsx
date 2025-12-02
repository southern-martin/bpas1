export function ClientSummary({ client, onEdit, onDelete, onCreateCard, onBack }) {
  return (
    <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div>
        <h1 style={{ margin: 0 }}>{client.name}</h1>
        <p className="small" style={{ margin: 0 }}>
          Contact record with linked projects and cards.
        </p>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={onBack} className="btn btn-light">
          ← Back
        </button>
        <button className="btn btn-primary" onClick={onCreateCard}>
          + Create Card
        </button>
        <button onClick={onEdit} className="btn btn-light">
          Edit
        </button>
        <button onClick={onDelete} className="btn btn-light" style={{ background: "#fee2e2", color: "#991b1b" }}>
          Delete
        </button>
      </div>
    </div>
  );
}
