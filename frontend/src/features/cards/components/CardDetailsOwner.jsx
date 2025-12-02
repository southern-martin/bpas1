import { Link } from "react-router-dom";
import { CardStatusSelect } from "./CardStatusSelect.jsx";
import { CardLinkSelector } from "./CardLinkSelector.jsx";
import { CardAssigneeSelect } from "./CardAssigneeSelect.jsx";
import { CardActivityTimeline } from "./CardActivityTimeline.jsx";

export function CardDetailsOwner({
  card,
  status,
  statusOptions,
  clients,
  projects,
  staff,
  onStatusChange,
  onClientChange,
  onProjectChange,
  onAssigneeChange
}) {
  const clientMap = Object.fromEntries(clients.map(c => [c.id, c.name]));
  const projectMap = Object.fromEntries(projects.map(p => [p.id, p.name]));

  return (
    <div style={{ padding: 20 }}>
      <h1>{card.title}</h1>

      <CardStatusSelect value={status} options={statusOptions} onChange={onStatusChange} />

      <CardLinkSelector
        label="Client"
        value={card.linked_client_id}
        options={clients}
        onChange={onClientChange}
        renderLabel={clientId =>
          clientId ? <Link to={`/office/client/${clientId}`}>{clientMap[clientId] || clientId}</Link> : "None"
        }
      />

      <CardLinkSelector
        label="Project"
        value={card.linked_project_id}
        options={projects}
        onChange={onProjectChange}
        renderLabel={projectId =>
          projectId ? <Link to={`/office/project/${projectId}`}>{projectMap[projectId] || projectId}</Link> : "None"
        }
      />

      <CardAssigneeSelect staff={staff} value={card.assigned_to_user_id} onChange={onAssigneeChange} />

      <div style={{ marginTop: 20 }}>
        <h3>Details</h3>
        <p>Type: {card.type}</p>
        <p>Notes: {card.notes_clarified || card.notes_raw || "—"}</p>
      </div>

      <CardActivityTimeline activities={card.activities} />
    </div>
  );
}
