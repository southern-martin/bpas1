import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useToast } from "../components/ToastProvider.jsx";
import { useFieldCard, FieldCardView } from "../features/field/index.js";

export default function FieldCard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const {
    state: { card, status, clients, projects, rawNotes, clarifiedNotes, saving, recording, offline, pendingCount },
    actions: {
      setStatus,
      setRawNotes,
      setClarifiedNotes,
      handleClarify,
      handleSave,
      handleStartRecording,
      handleStopRecording
    }
  } = useFieldCard(id, toast, navigate);

  if (localStorage.getItem("role") !== "Staff") {
    return <Navigate to="/login" replace />;
  }

  if (!card) return <p>Loading…</p>;

  const clientName =
    clients.find(c => c.id === card.linked_client_id)?.name || "—";
  const projectName =
    projects.find(p => p.id === card.linked_project_id)?.name || "—";

  return (
    <FieldCardView
      card={card}
      clientName={clientName}
      projectName={projectName}
      offline={offline}
      pendingCount={pendingCount}
      status={status}
      onStatusChange={setStatus}
      recording={recording}
      onStartRecording={handleStartRecording}
      onStopRecording={handleStopRecording}
      onClarify={handleClarify}
      rawNotes={rawNotes}
      onRawNotesChange={setRawNotes}
      clarifiedNotes={clarifiedNotes}
      onClarifiedNotesChange={setClarifiedNotes}
      onClearNotes={() => {
        setRawNotes("");
        setClarifiedNotes("");
      }}
      onSave={handleSave}
      saving={saving}
    />
  );
}
