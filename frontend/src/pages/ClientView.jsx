import { useParams, useNavigate, Navigate } from "react-router-dom";
import {
  ClientSummary,
  ClientInfo,
  ClientProjects,
  useClientDetails
} from "../features/clients/index.js";

export default function ClientView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { client, loading, error, deleteClient } = useClientDetails(id);

  if (localStorage.getItem("role") !== "Owner") {
    return <Navigate to="/login" replace />;
  }

  if (loading) return <div className="page">Loading...</div>;
  if (error) return <div className="page">Failed to load client.</div>;
  if (!client) return <div className="page">Client not found.</div>;

  return (
    <div className="page space-y-6">
      <ClientSummary
        client={client}
        onBack={() => navigate(-1)}
        onCreateCard={() => navigate(`/office/create-card?client=${client.id}`)}
        onEdit={() => navigate(`/office/client/${client.id}/edit`)}
        onDelete={async () => {
          if (!confirm("Delete this client? This cannot be undone.")) return;
          try {
            await deleteClient();
            navigate("/office/clients");
          } catch (err) {
            console.error("Failed to delete client:", err);
            alert("Failed to delete client");
          }
        }}
      />
      <ClientInfo client={client} />
      <ClientProjects
        projects={client.projects}
        onCreateCard={() => navigate(`/office/create-card?client=${client.id}`)}
        onProjectClick={projectId => navigate(`/office/project/${projectId}`)}
      />
    </div>
  );
}
