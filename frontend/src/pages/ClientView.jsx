import { useEffect, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { api } from "../api/client.js";

export default function ClientView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadClient() {
    try {
      const res = await api.get(`/clients/${id}`);
      setClient(res.data);
    } catch (err) {
      console.error("Failed to load client:", err);
    }
    setLoading(false);
  }

  async function deleteClient() {
    if (!confirm("Delete this client? This cannot be undone.")) return;
    try {
      await api.delete(`/clients/${id}`);
      navigate("/office/clients");
    } catch (err) {
      console.error("Failed to delete client:", err);
      alert("Failed to delete client");
    }
  }

  useEffect(() => {
    loadClient();
  }, [id]);

  if (localStorage.getItem("role") !== "Owner") {
    return <Navigate to="/login" replace />;
  }

  if (loading) return <div className="page">Loading...</div>;
  if (!client) return <div className="page">Client not found.</div>;

  return (
    <div className="page space-y-6 max-w-3xl">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <button onClick={() => navigate(-1)} className="btn btn-light" style={{ marginRight: 8 }}>
            ← Back
          </button>
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/office/create-card?client=${client.id}`)}
          >
            + Create Card
          </button>
        </div>
        <button onClick={deleteClient} className="btn btn-light" style={{ background: "#fee2e2", color: "#991b1b" }}>
          Delete
        </button>
      </div>

      {/* CLIENT INFO */}
      <div className="card space-y-2">
        <h1 style={{ margin: 0 }}>{client.name}</h1>
        <div><strong>Phone:</strong> {client.phone || "—"}</div>
        <div><strong>Email:</strong> {client.email || "—"}</div>
        <div><strong>Address:</strong> {client.address || "—"}</div>
        <div><strong>Notes:</strong> {client.notes || "—"}</div>
        <div className="text-sm" style={{ color: "#64748b" }}>
          Created: {client.created_at ? new Date(client.created_at).toLocaleString() : "—"}
        </div>
      </div>

      {/* PROJECTS */}
      <div className="card">
        <div className="flex justify-between items-center">
          <h2 style={{ margin: 0 }}>Projects</h2>
          <button
            className="btn btn-light"
            onClick={() => navigate(`/office/project/new?client=${client.id}`)}
          >
            + Add Project
          </button>
        </div>

        {(!client.projects || client.projects.length === 0) && <div>No projects yet.</div>}

        <div className="space-y-2" style={{ marginTop: 10 }}>
          {client.projects?.map(project => (
            <div
              key={project.id}
              className="pipeline-card"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/office/project/${project.id}`)}
            >
              <div className="card-title">{project.name}</div>
              <div className="card-subtitle">
                {project.created_at
                  ? `Created: ${new Date(project.created_at).toLocaleDateString()}`
                  : "No date"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
