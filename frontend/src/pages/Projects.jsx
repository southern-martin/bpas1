import { Navigate } from "react-router-dom";
import {
  ProjectsForm,
  ProjectsTable,
  useProjectsList
} from "../features/projects/index.js";

export default function Projects() {
  const {
    state: { projects, clients, newName, selectedClient, page, totalPages, pageData },
    actions: { setNewName, setSelectedClient, setPage, addProject, updateProject, deleteProject }
  } = useProjectsList();

  if (localStorage.getItem("role") !== "Owner") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="page">
      <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0 }}>Projects</h1>
          <p className="small">Manage projects and link them to clients.</p>
        </div>
      </div>

      <ProjectsForm
        newName={newName}
        selectedClient={selectedClient}
        clients={clients}
        onNameChange={setNewName}
        onClientChange={setSelectedClient}
        onSubmit={addProject}
      />

      <ProjectsTable projects={pageData} clients={clients} onUpdate={updateProject} onDelete={deleteProject} />

      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
          <button className="btn btn-light" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
            Prev
          </button>
          <div style={{ alignSelf: "center" }}>Page {page} / {totalPages}</div>
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
