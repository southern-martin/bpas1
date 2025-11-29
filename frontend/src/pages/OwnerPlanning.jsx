import { useEffect, useState } from "react";
import { api } from "../api/client.js";
import { Link, Navigate } from "react-router-dom";

export default function OwnerPlanning() {
  const [buckets, setBuckets] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  async function loadPlanning() {
    const res = await api.get("/planning");
    setBuckets(res.data);
    setLoading(false);
  }

  async function moveCard(cardId, bucketName) {
    await api.patch(`/planning/${cardId}`, {
      planning_bucket: bucketName
    });
    loadPlanning();
  }

  useEffect(() => {
    loadPlanning();
  }, []);

  if (localStorage.getItem("role") !== "Owner") {
    return <Navigate to="/login" replace />;
  }

  if (loading) return <p style={{ padding: 20 }}>Loading planning…</p>;

  const applySearch = cards =>
    cards.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div style={{ padding: 20 }}>
      <h1>Owner Planning</h1>
      <p className="small">Arrange cards into Tomorrow, Next Week, and Later.</p>
      <div style={{ marginBottom: 10 }}>
        <Link to="/office/create-card">+ Create Card</Link>
      </div>

      <div style={{ marginBottom: 12 }}>
        <input
          type="text"
          placeholder="Search cards..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="planning-grid">
        <PlanningColumn
          title="Tomorrow"
          cards={applySearch(buckets.tomorrow)}
          moveCard={moveCard}
        />
        <PlanningColumn
          title="Next Week"
          cards={applySearch(buckets.next_week)}
          moveCard={moveCard}
        />
        <PlanningColumn title="Later" cards={applySearch(buckets.later)} moveCard={moveCard} />
      </div>
    </div>
  );
}

function PlanningColumn({ title, cards, moveCard }) {
  return (
    <div className="planning-column">
      <h2>{title}</h2>

      {cards.length === 0 && <p className="small">Empty</p>}

      {cards.map(card => (
        <div key={card.id} className="planning-card">
          <div className="card-title">{card.title}</div>
          <div className="card-sub">
            {card.type} • {card.linked_client_id || "—"}
          </div>

          <div className="move-buttons">
            {title !== "Tomorrow" && (
              <button onClick={() => moveCard(card.id, "Tomorrow")}>Tomorrow</button>
            )}
            {title !== "Next Week" && (
              <button onClick={() => moveCard(card.id, "Next Week")}>Next Week</button>
            )}
            {title !== "Later" && (
              <button onClick={() => moveCard(card.id, "Later")}>Later</button>
            )}
            <button className="clear-btn" onClick={() => moveCard(card.id, null)}>
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
