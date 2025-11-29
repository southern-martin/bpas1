import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { api } from "../api/client.js";

export default function FieldToday() {
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const staffId = localStorage.getItem("userId") || "staff-1";

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const res = await api.get("/cards", {
      params: { assigned_to: staffId }
    });
    const list = res.data || [];
    setEvents(list.filter(c => c.type === "Event"));
    setTasks(list.filter(c => c.type === "Task" && c.status !== "Done"));
  }

  if (localStorage.getItem("role") !== "Staff") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="field-container">
      <div className="page-header">
        <h1>Today</h1>
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
    </div>
  );
}
