export function ClientsTable({ clients, onChangeField, onSave, onDelete }) {
  return (
    <div className="card">
      <table className="table">
        <thead>
          <tr>
            <th>Client Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Address</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(c => (
            <tr key={c.id}>
              <td>
                <a href={`/office/client/${c.id}`}>{c.name}</a>
              </td>
              <td>
                <input value={c.phone || ""} onChange={e => onChangeField(c.id, "phone", e.target.value)} />
              </td>
              <td>
                <input value={c.email || ""} onChange={e => onChangeField(c.id, "email", e.target.value)} />
              </td>
              <td>
                <input value={c.address || ""} onChange={e => onChangeField(c.id, "address", e.target.value)} />
              </td>
              <td>
                <textarea value={c.notes || ""} onChange={e => onChangeField(c.id, "notes", e.target.value)} rows={2} />
              </td>
              <td style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <button onClick={() => onSave(c.id)}>Save</button>
                <button onClick={() => onDelete(c.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
