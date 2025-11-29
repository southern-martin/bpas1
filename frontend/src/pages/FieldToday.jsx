import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { api } from "../api/client.js";
import {
  upsertCards,
  getCardsFromCache,
  upsertClients,
  upsertProjects,
  getQueueCount
} from "../offline/db.js";
import { initSyncLoop, processQueue } from "../offline/sync.js";

export default function FieldToday() {
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  const [offline, setOffline] = useState(!navigator.onLine);
  const [pendingCount, setPendingCount] = useState(0);
  const [lastSync, setLastSync] = useState(
    localStorage.getItem("lastSync")
  );
  const staffId = localStorage.getItem("userId") || "staff-1";

  useEffect(() => {
    load();

    const handler = e => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    const onlineHandler = () => setOffline(!navigator.onLine);
    window.addEventListener("online", onlineHandler);
    window.addEventListener("offline", onlineHandler);
    initSyncLoop();
    const queueInterval = setInterval(updateQueueCount, 4000);
    updateQueueCount();
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("online", onlineHandler);
      window.removeEventListener("offline", onlineHandler);
      clearInterval(queueInterval);
    };
  }, []);

  async function load() {
    try {
      const [cardsRes, clientsRes, projectsRes] = await Promise.all([
        api.get("/cards", { params: { assigned_to: staffId } }),
        api.get("/clients"),
        api.get("/projects")
      ]);
      const list = cardsRes.data || [];
      await upsertClients(clientsRes.data || []);
      await upsertProjects(projectsRes.data || []);
      await upsertCards(list);
      updateLists(list);
    } catch (err) {
      const cached = await getCardsFromCache();
      updateLists(
        cached.filter(c => c.assigned_to_user_id === staffId)
      );
    }
  }

  function updateLists(list) {
    setEvents(list.filter(c => c.type === "Event"));
    setTasks(list.filter(c => c.type === "Task" && c.status !== "Done"));
  }

  async function updateQueueCount() {
    const count = await getQueueCount();
    setPendingCount(count);
  }

  async function handleSyncNow() {
    const synced = await processQueue();
    updateQueueCount();
    if (synced > 0) {
      const ts = localStorage.getItem("lastSync");
      setLastSync(ts);
    }
  }

  if (localStorage.getItem("role") !== "Staff") {
    return <Navigate to="/login" replace />;
  }

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
            {pendingCount} pending changes — <button className="link-btn" onClick={handleSyncNow}>Sync now</button>
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
          <Link className="open-btn" to={`/field/card/${evt.id}`}>Open</Link>
        </div>
      ))}

      <h2 className="section-title">Tasks</h2>
      {tasks.length === 0 && <p className="empty">No tasks assigned.</p>}
      {tasks.map(task => (
        <div className="mobile-card" key={task.id}>
          <div className="card-title">{task.title}</div>
          <div className="status-chip">{task.status}</div>
          <Link className="open-btn" to={`/field/card/${task.id}`}>Open</Link>
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
            setDeferredPrompt(null);
            setShowInstall(false);
          }}
        >
          Install App
        </button>
      )}
    </div>
  );
}
