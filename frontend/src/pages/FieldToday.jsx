import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { api } from "../api/client.js";

export default function FieldToday() {
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await api.get("/cards");

      const all = res.data || [];

      setEvents(all.filter(c => c.type === "Event"));
      setTasks(all.filter(c => c.type === "Task" && c.status !== "Done"));
    }

    load();
  }, []);

  if (localStorage.getItem("role") !== "Staff") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Today’s Summary</h1>

      <section>
        <h2>Events Today</h2>
        {events.length === 0 && <p>No events.</p>}
        {events.map(evt => (
          <div key={evt.id} className="card">
            <div className="title">
              {evt.event_time ? `${evt.event_time} — ` : ""}
              {evt.title}
            </div>
            <div className="small">Client: {evt.linked_client_id || "—"}</div>
            <Link to={`/field/card/${evt.id}`}>Open</Link>
          </div>
        ))}
      </section>

      <section style={{ marginTop: 20 }}>
        <h2>Your Tasks</h2>
        {tasks.length === 0 && <p>No tasks for today.</p>}
        {tasks.map(task => (
          <div key={task.id} className="card">
            <div className="title">{task.title}</div>
            <div className="small">Client: {task.linked_client_id || "—"}</div>
            <Link to={`/field/card/${task.id}`}>Open</Link>
          </div>
        ))}
      </section>
    </div>
  );
}
