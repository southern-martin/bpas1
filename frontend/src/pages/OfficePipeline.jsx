import { useEffect, useState } from "react";
import { api } from "../api/client.js";
import {
  DragDropContext,
  Droppable,
  Draggable
} from "react-beautiful-dnd";
import { Link, Navigate } from "react-router-dom";

export default function OfficePipeline() {
  const [pipeline, setPipeline] = useState({
    to_do: [],
    doing: [],
    done: [],
    blocked: []
  });
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [clientFilter, setClientFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadPipeline();
    api.get("/clients").then(r => setClients(r.data));
    api.get("/projects").then(r => setProjects(r.data));
  }, []);

  async function loadPipeline() {
    const res = await api.get("/pipeline");
    setPipeline(res.data);
  }

  async function handleDragEnd(result) {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const statusMap = {
      "todo-col": "To Do",
      "doing-col": "Doing",
      "done-col": "Done",
      "blocked-col": "Blocked"
    };

    const newStatus = statusMap[destination.droppableId];

    await api.patch(`/cards/${draggableId}`, { status: newStatus });

    loadPipeline();
  }

  function filterCards(cards) {
    return cards.filter(card => {
      if (clientFilter && card.linked_client_id !== clientFilter) return false;
      if (projectFilter && card.linked_project_id !== projectFilter) return false;
      if (searchTerm && !card.title.toLowerCase().includes(searchTerm.toLowerCase()))
        return false;
      return true;
    });
  }

  if (localStorage.getItem("role") !== "Owner") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="page">
      <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0 }}>Pipeline Board</h1>
          <p style={{ margin: 0, color: "#6b7280" }}>Drag cards to move status. Filter by client/project or search.</p>
        </div>
        <Link className="btn btn-primary" to="/office/create-card">
          + Create Card
        </Link>
      </div>

      <div className="card">
        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search cards..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <select value={clientFilter} onChange={e => setClientFilter(e.target.value)}>
            <option value="">All Clients</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={projectFilter}
            onChange={e => setProjectFilter(e.target.value)}
            style={{ marginLeft: 10 }}
          >
            <option value="">All Projects</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setClientFilter("");
              setProjectFilter("");
              setSearchTerm("");
            }}
            style={{ marginLeft: 10 }}
          >
            Clear
          </button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="pipeline-grid">
          <PipelineColumn
            droppableId="todo-col"
            title="To Do"
            cards={filterCards(pipeline.to_do)}
          />
          <PipelineColumn
            droppableId="doing-col"
            title="Doing"
            cards={filterCards(pipeline.doing)}
          />
          <PipelineColumn
            droppableId="done-col"
            title="Done"
            cards={filterCards(pipeline.done)}
          />
          <PipelineColumn
            droppableId="blocked-col"
            title="Blocked"
            cards={filterCards(pipeline.blocked)}
          />
        </div>
      </DragDropContext>
    </div>
  );
}

function PipelineColumn({ droppableId, title, cards }) {
  return (
    <Droppable droppableId={droppableId}>
      {provided => (
        <div
          className="pipeline-column"
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <h2>{title}</h2>

          {cards.map((card, index) => (
            <Draggable key={card.id} draggableId={card.id} index={index}>
              {providedDrag => (
                <div
                  className="pipeline-card"
                  ref={providedDrag.innerRef}
                  {...providedDrag.draggableProps}
                  {...providedDrag.dragHandleProps}
                >
                  <div className="card-title">{card.title}</div>
                  <div className="card-subtitle">
                    {card.type} • {card.linked_client_id || "—"}
                  </div>
                </div>
              )}
            </Draggable>
          ))}

          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
