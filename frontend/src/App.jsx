import { Routes, Route, Navigate } from "react-router-dom";
import FieldToday from "./pages/FieldToday.jsx";
import FieldCard from "./pages/FieldCard.jsx";
import OfficePipeline from "./pages/OfficePipeline.jsx";
import OwnerPlanning from "./pages/OwnerPlanning.jsx";
import Clients from "./pages/Clients.jsx";
import Projects from "./pages/Projects.jsx";
import OwnerCardDetails from "./pages/OwnerCardDetails.jsx";
import ClientView from "./pages/ClientView.jsx";
import ProjectView from "./pages/ProjectView.jsx";
import Login from "./pages/Login.jsx";
import CreateCard from "./pages/CreateCard.jsx";
import OwnerDashboard from "./pages/OwnerDashboard.jsx";
import { Link } from "react-router-dom";
import OfficeLayout from "./layouts/OfficeLayout.jsx";
import ClientEdit from "./pages/ClientEdit.jsx";

export default function App() {
  const isAuthed = Boolean(localStorage.getItem("token"));
  const role = localStorage.getItem("role");
  const isStaff = role === "Staff";

  return (
    <>
      <nav className="top-nav">
        <div className="top-nav-brand">BPAS</div>
        <div className="top-nav-links">
          {isStaff && <Link to="/field/today">Field</Link>}
          <Link to="/office/dashboard">Dashboard</Link>
          <Link to="/office/pipeline">Pipeline</Link>
          <Link to="/office/planning">Planning</Link>
        </div>
        <div className="top-nav-actions">
          <Link to="/office/create-card">Create Card</Link>
          {isAuthed && (
            <button
              className="logout-btn"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                localStorage.removeItem("userId");
                window.location.href = "/login";
              }}
            >
              Logout
            </button>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/field/today" element={<FieldToday />} />
        <Route path="/field/card/:id" element={<FieldCard />} />

        <Route
          path="/office/pipeline"
          element={
            <OfficeLayout>
              <OfficePipeline />
            </OfficeLayout>
          }
        />
        <Route
          path="/office/dashboard"
          element={
            <OfficeLayout>
              <OwnerDashboard />
            </OfficeLayout>
          }
        />
        <Route
          path="/office/planning"
          element={
            <OfficeLayout>
              <OwnerPlanning />
            </OfficeLayout>
          }
        />
        <Route
          path="/office/clients"
          element={
            <OfficeLayout>
              <Clients />
            </OfficeLayout>
          }
        />
        <Route
          path="/office/projects"
          element={
            <OfficeLayout>
              <Projects />
            </OfficeLayout>
          }
        />
        <Route
          path="/office/card/:id"
          element={
            <OfficeLayout>
              <OwnerCardDetails />
            </OfficeLayout>
          }
        />
        <Route
          path="/office/client/:id"
          element={
            <OfficeLayout>
              <ClientView />
            </OfficeLayout>
          }
        />
        <Route
          path="/office/client/:id/edit"
          element={
            <OfficeLayout>
              <ClientEdit />
            </OfficeLayout>
          }
        />
        <Route
          path="/office/project/:id"
          element={
            <OfficeLayout>
              <ProjectView />
            </OfficeLayout>
          }
        />
        <Route
          path="/office/create-card"
          element={
            <OfficeLayout>
              <CreateCard />
            </OfficeLayout>
          }
        />

        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

function HomeRedirect() {
  const role = localStorage.getItem("role");
  if (role === "Staff") return <Navigate to="/field/today" replace />;
  if (role === "Owner") return <Navigate to="/office/dashboard" replace />;
  return <Navigate to="/login" replace />;
}
