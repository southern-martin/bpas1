export function FieldCardView({
  card,
  clientName,
  projectName,
  offline,
  pendingCount,
  status,
  onStatusChange,
  recording,
  onStartRecording,
  onStopRecording,
  onClarify,
  rawNotes,
  onRawNotesChange,
  clarifiedNotes,
  onClarifiedNotesChange,
  onClearNotes,
  onSave,
  saving
}) {
  return (
    <div className="field-container">
      <div className="page-header">
        <h1>{card.title}</h1>
        {offline && (
          <div className="offline-banner">
            Offline — changes will sync when online{pendingCount ? ` (${pendingCount} pending)` : ""}
          </div>
        )}
      </div>

      <p>Client: {clientName}</p>
      <p>Project: {projectName}</p>

      <div className="status-row">
        <label>Status</label>
        <select className="status-select" value={status} onChange={e => onStatusChange(e.target.value)}>
          <option>To Do</option>
          <option>Doing</option>
          <option>Blocked</option>
          <option>Done</option>
        </select>
      </div>

      <div className="button-row">
        {!recording ? (
          <button className="record-btn" onClick={onStartRecording}>
            🎤 Record
          </button>
        ) : (
          <button className="stop-btn" onClick={onStopRecording}>
            ⏹ Stop
          </button>
        )}

        <button className="clarify-btn" onClick={onClarify}>
          ✨ Clarify
        </button>
        <button className="clear-btn" onClick={onClearNotes}>
          🗑 Clear
        </button>
      </div>

      <textarea
        className="notes-input"
        value={rawNotes}
        onChange={e => onRawNotesChange(e.target.value)}
        placeholder="Speak or type your notes..."
      />

      <textarea
        className="notes-clarified"
        value={clarifiedNotes}
        onChange={e => onClarifiedNotesChange(e.target.value)}
        placeholder="Clarified notes appear here..."
      />

      <button className="save-btn" onClick={onSave} disabled={saving}>
        {saving ? "Saving…" : "💾 Save"}
      </button>
    </div>
  );
}
