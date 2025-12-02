export function ProjectsForm({ newName, selectedClient, clients, onNameChange, onClientChange, onSubmit }) {
  return (
    <div className="card" style={{ display: "grid", gap: 8 }}>
      <input placeholder="New project name" value={newName} onChange={e => onNameChange(e.target.value)} />
      <select value={selectedClient} onChange={e => onClientChange(e.target.value)}>
        <option value="">Select client</option>
        {clients.map(c => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <button className="btn btn-primary" onClick={onSubmit}>
        + Add Project
      </button>
    </div>
  );
}
