function InfoItem({ label, value }) {
  return (
    <div style={{ padding: 10, border: "1px solid var(--border)", borderRadius: "10px", background: "white" }}>
      <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 15, color: "#0f172a" }}>{value || "—"}</div>
    </div>
  );
}

export function ClientInfo({ client }) {
  return (
    <div className="card">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: 12 }}>
        <InfoItem label="Phone" value={client.phone} />
        <InfoItem label="Email" value={client.email} />
        <InfoItem label="Address" value={client.address} />
        <InfoItem label="Notes" value={client.notes} />
      </div>
      <div className="text-sm" style={{ color: "#64748b", marginTop: 10 }}>
        Created: {client.created_at ? new Date(client.created_at).toLocaleString() : "—"}
      </div>
    </div>
  );
}
