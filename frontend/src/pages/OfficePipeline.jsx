import { useEffect, useState } from "react";
import { api } from "../api/client.js";
import {
  DragDropContext,
  Droppable,
  Draggable
} from "react-beautiful-dnd";

export default function OfficePipeline() {
  const [pipeline, setPipeline] = useState({
    to_do: [],
    doing: [],
    done: [],
    blocked: []
  });

  useEffect(() => {
    loadPipeline();
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

  return (
    <div style={{ padding: 20 }}>
      <h1>Pipeline Board</h1>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="pipeline-grid">
          <PipelineColumn
            droppableId="todo-col"
            title="To Do"
            cards={pipeline.to_do}
          />
          <PipelineColumn
            droppableId="doing-col"
            title="Doing"
            cards={pipeline.doing}
          />
          <PipelineColumn
            droppableId="done-col"
            title="Done"
            cards={pipeline.done}
          />
          <PipelineColumn
            droppableId="blocked-col"
            title="Blocked"
            cards={pipeline.blocked}
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
