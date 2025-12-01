import { useEffect, useState } from "react";
import { api } from "../api/client.js";
import { Link, Navigate } from "react-router-dom";
import dayjs from "dayjs";

export default function OwnerDashboard() {
  const [cards, setCards] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const cardRes = await api.get("/cards");
    setCards(cardRes.data || []);

    const activityRes = await api.get("/activities/recent");
    setActivities(activityRes.data || []);
  }

  const count = status => cards.filter(c => c.status === status).length;

  const todayEvents = cards.filter(
    c => c.type === "Event" && c.event_time && dayjs(c.event_time).isSame(dayjs(), "day")
  );

  const staffMap = {};
  cards.forEach(c => {
    if (!c.assigned_to_user_id) return;
    staffMap[c.assigned_to_user_id] = (staffMap[c.assigned_to_user_id] || 0) + 1;
  });

  if (localStorage.getItem("role") !== "Owner") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="page">
      <h1 style={{ marginBottom: 12 }}>Owner Dashboard</h1>

      <div className="card">
        <div className="stats-row">
          <StatBox label="Total Cards" value={cards.length} />
          <StatBox label="To Do" value={count("To Do")} />
          <StatBox label="Doing" value={count("Doing")} />
          <StatBox label="Done" value={count("Done")} />
          <StatBox label="Blocked" value={count("Blocked")} />
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Today's Events</h2>
        {todayEvents.length === 0 && <p>No events today.</p>}
        {todayEvents.map(evt => (
          <div key={evt.id} className="dash-card">
            <strong>{evt.title}</strong>
            <div>{evt.event_time}</div>
            <Link to={`/office/card/${evt.id}`}>Open</Link>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Workload by Staff</h2>
        {Object.keys(staffMap).length === 0 && <p>No staff workload.</p>}
        {Object.entries(staffMap).map(([id, count]) => (
          <div key={id} className="dash-line">
            Staff {id}: {count} cards
          </div>
        ))}
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Recent Activity</h2>
        {activities.length === 0 && <p>No activity yet.</p>}
        {activities.map(a => (
          <div key={a.id} className="dash-card">
            <div>
              <strong>{a.card_title}</strong> — {a.action}
            </div>
            <div className="time">{dayjs(a.created_at).format("MMM D, h:mm A")}</div>
            <Link to={`/office/card/${a.card_id}`}>Open</Link>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Quick Actions</h2>
        <div className="quick-buttons">
          <Link className="quick-btn" to="/office/create-card">
            + Create Card
          </Link>
          <Link className="quick-btn" to="/office/pipeline">
            Pipeline
          </Link>
          <Link className="quick-btn" to="/office/planning">
            Planning
          </Link>
          <Link className="quick-btn" to="/office/clients">
            Clients
          </Link>
          <Link className="quick-btn" to="/office/projects">
            Projects
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div className="stat-box">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
