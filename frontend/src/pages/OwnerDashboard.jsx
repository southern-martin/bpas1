import { Navigate } from "react-router-dom";
import { DashboardView, useOwnerDashboard } from "../features/dashboard/index.js";

export default function OwnerDashboard() {
  const { cards, activities, count, todayEvents, staffMap } = useOwnerDashboard();

  if (localStorage.getItem("role") !== "Owner") {
    return <Navigate to="/login" replace />;
  }

  return <DashboardView cards={cards} activities={activities} count={count} todayEvents={todayEvents} staffMap={staffMap} />;
}
