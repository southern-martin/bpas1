import { Link } from "react-router-dom";

export function FieldTodayView({
  events,
  tasks,
  offline,
  pendingCount,
  lastSync,
  showInstall,
  onInstall,
  deferredPrompt,
  setShowInstall,
  status,
  handleSyncNow
}) {
  return (
    <div className="field-container">
      <div className="page-header">
        <h1>Today</h1>
        {offline && (
          <div className="offline-banner">
            Offline — changes will sync when online{pendingCount ? ` (${pendingCount} pending)` : ""}
          </div>
        )}
        {!offline && pendingCount > 0 && (
          <div className="offline-banner">
            {pendingCount} pending changes —{" "}
            <button className="link-btn" onClick={handleSyncNow}>
              Sync now
            </button>
          </div>
        )}
        {lastSync && (
          <div className="offline-banner" style={{ background: "#e0f2fe", color: "#075985" }}>
            Last synced: {new Date(parseInt(lastSync, 10)).toLocaleString()}
          </div>
        )}
      </div>

      <h2 className="section-title">Events</h2>
      {events.length === 0 && <p className="empty">No events today.</p>}
      {events.map(evt => (
        <div className="mobile-card" key={evt.id}>
          <div className="card-title">{evt.title}</div>
          {evt.event_time && <div className="time-label">🕒 {evt.event_time}</div>}
          <Link className="open-btn" to={`/field/card/${evt.id}`}>
            Open
          </Link>
        </div>
      ))}

      <h2 className="section-title">Tasks</h2>
      {tasks.length === 0 && <p className="empty">No tasks assigned.</p>}
      {tasks.map(task => (
        <div className="mobile-card" key={task.id}>
          <div className="card-title">{task.title}</div>
          <div className="status-chip">{task.status}</div>
          <Link className="open-btn" to={`/field/card/${task.id}`}>
            Open
          </Link>
        </div>
      ))}

      {showInstall && (
        <button
          className="install-btn"
          onClick={async () => {
            if (!deferredPrompt) return;
            deferredPrompt.prompt();
            const choice = await deferredPrompt.userChoice;
            if (choice.outcome === "accepted") console.log("PWA Installed");
            setShowInstall(false);
          }}
        >
          Install App
        </button>
      )}
    </div>
  );
}
