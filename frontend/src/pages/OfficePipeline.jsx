import { Navigate, useNavigate } from "react-router-dom";
import { PipelineBoard, usePipelineBoard } from "../features/pipeline/index.js";

export default function OfficePipeline() {
  const navigate = useNavigate();
  const {
    state: { pipeline, clients, projects, clientFilter, projectFilter, searchTerm },
    actions: { setClientFilter, setProjectFilter, setSearchTerm, clearFilters, handleDragEnd }
  } = usePipelineBoard();

  if (localStorage.getItem("role") !== "Owner") {
    return <Navigate to="/login" replace />;
  }

  return (
    <PipelineBoard
      pipeline={pipeline}
      clients={clients}
      projects={projects}
      clientFilter={clientFilter}
      projectFilter={projectFilter}
      searchTerm={searchTerm}
      onClientFilter={setClientFilter}
      onProjectFilter={setProjectFilter}
      onSearch={setSearchTerm}
      onClear={clearFilters}
      onDragEnd={handleDragEnd}
      onCreateCard={() => navigate("/office/create-card")}
    />
  );
}
