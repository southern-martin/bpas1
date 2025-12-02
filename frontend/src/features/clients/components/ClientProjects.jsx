export function ClientProjects({ projects = [], onCreateCard, onProjectClick }) {
  return (
    <div className="card">
      <div className="flex justify-between items-center">
        <h2 style={{ margin: 0 }}>Projects</h2>
        <button className="btn btn-light" onClick={onCreateCard}>
          + Create Card
        </button>
      </div>

      {(!projects || projects.length === 0) && <div>No projects yet.</div>}

      <div className="space-y-2" style={{ marginTop: 10 }}>
        {projects.map(project => (
          <div
            key={project.id}
            className="pipeline-card"
            style={{ cursor: "pointer" }}
            onClick={() => onProjectClick(project.id)}
          >
            <div className="card-title">{project.name}</div>
            <div className="card-subtitle">
              {project.created_at ? `Created: ${new Date(project.created_at).toLocaleDateString()}` : "No date"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
