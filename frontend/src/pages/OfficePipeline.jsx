import { useEffect, useState } from "react";
import { api } from "../api/client.js";

export default function OfficePipeline() {
  const [pipeline, setPipeline] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await api.get("/pipeline");
      setPipeline(res.data);
    }
    load();
  }, []);

  if (!pipeline) return <p style={{ padding: 20 }}>Loading pipeline…</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Pipeline Board</h1>

      <div className="pipeline-grid">
        <PipelineColumn title="To Do" cards={pipeline.to_do} />
        <PipelineColumn title="Doing" cards={pipeline.doing} />
        <PipelineColumn title="Done / Blocked" cards={[...pipeline.done, ...pipeline.blocked]} />
      </div>
    </div>
  );
}

function PipelineColumn({ title, cards }) {
  return (
    <div className="pipeline-column">
      <h2>{title}</h2>

      {cards.length === 0 && <p className="small">No cards.</p>}

      {cards.map(card => (
        <div key={card.id} className="pipeline-card">
          <div className="card-title">{card.title}</div>
          <div className="card-subtitle">
            {card.type} • {card.linked_client_id || "No Client"}
          </div>
        </div>
      ))}
    </div>
  );
}
