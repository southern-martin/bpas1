import { useParams, Navigate } from "react-router-dom";
import { CardDetailsOwner, useOwnerCardDetails } from "../features/cards/index.js";

export default function OwnerCardDetails() {
  const { id } = useParams();
  const {
    card,
    clients,
    projects,
    staff,
    status,
    statusOptions,
    loading,
    error,
    updateStatus,
    updateLinkedClient,
    updateLinkedProject,
    updateAssignee
  } = useOwnerCardDetails(id);

  return (
    localStorage.getItem("role") !== "Owner" ? (
      <Navigate to="/login" replace />
    ) : loading ? (
      <p style={{ padding: 20 }}>Loading…</p>
    ) : error ? (
      <p style={{ padding: 20 }}>Failed to load card.</p>
    ) : !card ? (
      <p style={{ padding: 20 }}>Card not found.</p>
    ) : (
      <CardDetailsOwner
        card={card}
        status={status}
        statusOptions={statusOptions}
        clients={clients}
        projects={projects}
        staff={staff}
        onStatusChange={updateStatus}
        onClientChange={updateLinkedClient}
        onProjectChange={updateLinkedProject}
        onAssigneeChange={updateAssignee}
      />
    )
  );
}
