import { Navigate, useNavigate } from "react-router-dom";
import { PlanningBoard, useOwnerPlanning } from "../features/planning/index.js";

export default function OwnerPlanning() {
  const navigate = useNavigate();
  const { buckets, loading, searchTerm, setSearchTerm, moveCard } = useOwnerPlanning();

  if (localStorage.getItem("role") !== "Owner") {
    return <Navigate to="/login" replace />;
  }

  if (loading || !buckets) return <p style={{ padding: 20 }}>Loading planning…</p>;

  return (
    <PlanningBoard
      buckets={buckets}
      searchTerm={searchTerm}
      onSearch={setSearchTerm}
      moveCard={moveCard}
      onCreateCard={() => navigate("/office/create-card")}
    />
  );
}
