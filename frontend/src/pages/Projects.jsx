import { useEffect, useState } from "react";
import { api } from "../api/client.js";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [newName, setNewName] = useState("");
  const [selectedClient, setSelectedClient] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const p = await api.get("/projects");
    const c = await api.get("/clients");
    setProjects(p.data);
    setClients(c.data);
  }

  async function addProject() {
    if (!newName.trim() || !selectedClient) return;
    await api.post("/projects", { name: newName, client_id: selectedClient });
    setNewName("");
    setSelectedClient("");
    load();
  }

  async function updateProject(id, field, value) {
    await api.patch(`/projects/${id}`, { [field]: value });
    load();
  }

  async function deleteProject(id) {
    await api.delete(`/projects/${id}`);
    load();
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Projects</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="New project name"
          value={newName}
          onChange={e => setNewName(e.target.value)}
        />
        <select value={selectedClient} onChange={e => setSelectedClient(e.target.value)}>
          <option value="">Select client</option>
          {clients.map(c => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button onClick={addProject} style={{ marginLeft: 8 }}>
          Add
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Client</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(p => (
            <tr key={p.id}>
              <td>
                <input
                  value={p.name}
                  onChange={e => updateProject(p.id, "name", e.target.value)}
                />
              </td>
              <td>
                <select
                  value={p.client_id}
                  onChange={e => updateProject(p.id, "client_id", e.target.value)}
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <button onClick={() => deleteProject(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
