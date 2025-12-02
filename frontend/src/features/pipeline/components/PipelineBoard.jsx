import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export function PipelineBoard({
  pipeline,
  clients,
  projects,
  clientFilter,
  projectFilter,
  searchTerm,
  onClientFilter,
  onProjectFilter,
  onSearch,
  onClear,
  onDragEnd,
  onCreateCard
}) {
  return (
    <div className="page">
      <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0 }}>Pipeline Board</h1>
          <p style={{ margin: 0, color: "#6b7280" }}>Drag cards to move status. Filter by client/project or search.</p>
        </div>
        <button className="btn btn-primary" onClick={onCreateCard}>
          + Create Card
        </button>
      </div>

      <div className="card">
        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search cards..."
            value={searchTerm}
            onChange={e => onSearch(e.target.value)}
            className="search-input"
          />

          <select value={clientFilter} onChange={e => onClientFilter(e.target.value)}>
            <option value="">All Clients</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select value={projectFilter} onChange={e => onProjectFilter(e.target.value)} style={{ marginLeft: 10 }}>
            <option value="">All Projects</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <button onClick={onClear} style={{ marginLeft: 10 }}>
            Clear
          </button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="pipeline-grid">
          <PipelineColumn droppableId="todo-col" title="To Do" cards={pipeline.to_do} />
          <PipelineColumn droppableId="doing-col" title="Doing" cards={pipeline.doing} />
          <PipelineColumn droppableId="done-col" title="Done" cards={pipeline.done} />
          <PipelineColumn droppableId="blocked-col" title="Blocked" cards={pipeline.blocked} />
        </div>
      </DragDropContext>
    </div>
  );
}

function PipelineColumn({ droppableId, title, cards }) {
  return (
    <Droppable droppableId={droppableId}>
      {provided => (
        <div className="pipeline-column" ref={provided.innerRef} {...provided.droppableProps}>
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
