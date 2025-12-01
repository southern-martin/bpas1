import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { api } from "../api/client.js";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [newName, setNewName] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const p = await api.get("/projects");
    const c = await api.get("/clients");
    setProjects(p.data);
    setClients(c.data);
    setPage(1);
  }

  async function addProject() {
    if (!newName.trim() || !selectedClient) return;
    await api.post("/projects", { name: newName, client_id: selectedClient });
    setNewName("");
    setSelectedClient("");
    window.__toast?.success?.("Project added");
    load();
  }

  async function updateProject(id, field, value) {
    await api.patch(`/projects/${id}`, { [field]: value });
    window.__toast?.success?.("Project updated");
    load();
  }

  async function deleteProject(id) {
    await api.delete(`/projects/${id}`);
    window.__toast?.info?.("Project deleted");
    load();
  }

  if (localStorage.getItem("role") !== "Owner") {
    return <Navigate to="/login" replace />;
  }

  const totalPages = Math.max(1, Math.ceil(projects.length / pageSize));
  const pageData = projects.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="page">
      <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0 }}>Projects</h1>
          <p className="small">Manage projects and link them to clients.</p>
        </div>
        <button className="btn btn-primary" onClick={addProject}>
          + Add Project
        </button>
      </div>

      <div className="card" style={{ display: "grid", gap: 8 }}>
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
      </div>

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
            {pageData.map(p => (
              <tr key={p.id}>
                <td>
                  <Link to={`/office/project/${p.id}`}>{p.name}</Link>
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
                    <input
                      value={p.name}
                      onChange={e => updateProject(p.id, "name", e.target.value)}
                  />
                  </td>
                  <td>
                    <button onClick={() => deleteProject(p.id)}>Delete</button>
                  </td>
                </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
          <button
            className="btn btn-light"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Prev
          </button>
          <div style={{ alignSelf: "center" }}>
            Page {page} / {totalPages}
          </div>
          <button
            className="btn btn-light"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
