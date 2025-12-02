import { useNavigate, useParams, Navigate } from "react-router-dom";
import { ProjectDetailsView, useProjectDetails } from "../features/projects/index.js";

export default function ProjectView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { project, client, cards, groupCards } = useProjectDetails(id);

  if (localStorage.getItem("role") !== "Owner") {
    return <Navigate to="/login" replace />;
  }

  return (
    <ProjectDetailsView
      project={project}
      client={client}
      cards={cards}
      groupCards={groupCards}
      onBack={() => navigate(-1)}
      onCreateCard={() => navigate(`/office/create-card?project=${project?.id}&client=${project?.client_id}`)}
    />
  );
}
