import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api/client.js";

export default function ClientView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState(null);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    load();
  }, [id]);

  async function load() {
    const c = await api.get(`/clients/${id}`);
    const cardRes = await api.get(`/clients/${id}/cards`);
    setClient(c.data);
    setCards(cardRes.data);
  }

  function groupCards(status) {
    return cards.filter(c => c.status === status);
  }

  if (localStorage.getItem("role") !== "Owner") {
    return <Navigate to="/login" replace />;
  }

  if (!client) return <p style={{ padding: 20 }}>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <button onClick={() => navigate(-1)}>← Back</button>
      <button onClick={() => navigate(`/office/create-card?client=${client.id}`)} style={{ marginLeft: 8 }}>
        + Create Card
      </button>

      <h1>{client.name}</h1>
      <p>{cards.length} card(s)</p>

      <div className="pipeline-grid" style={{ marginTop: 20 }}>
        <CardColumn title="To Do" cards={groupCards("To Do")} navigate={navigate} />
        <CardColumn title="Doing" cards={groupCards("Doing")} navigate={navigate} />
        <CardColumn title="Done" cards={groupCards("Done")} navigate={navigate} />
        <CardColumn title="Blocked" cards={groupCards("Blocked")} navigate={navigate} />
      </div>
    </div>
  );
}

function CardColumn({ title, cards, navigate }) {
  return (
    <div className="pipeline-column">
      <h2>{title}</h2>

      {cards.length === 0 && <p className="small">None</p>}

      {cards.map(card => (
        <div
          key={card.id}
          className="pipeline-card"
          onClick={() => navigate(`/office/card/${card.id}`)}
          style={{ cursor: "pointer" }}
        >
          <div className="card-title">{card.title}</div>
          <div className="card-subtitle">
            {card.type} • proj {card.linked_project_id || "—"}
          </div>
        </div>
      ))}
    </div>
  );
}
