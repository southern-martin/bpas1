export function ProjectsTable({ projects, clients, onUpdate, onDelete }) {
  return (
    <div className="card">
      <table className="table">
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Client</th>
            <th>Rename</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(p => (
            <tr key={p.id}>
              <td>
                <a href={`/office/project/${p.id}`}>{p.name}</a>
              </td>
              <td>
                <select value={p.client_id} onChange={e => onUpdate(p.id, "client_id", e.target.value)}>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input value={p.name} onChange={e => onUpdate(p.id, "name", e.target.value)} />
              </td>
              <td>
                <button onClick={() => onDelete(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
