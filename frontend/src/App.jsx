import { Routes, Route } from "react-router-dom";
import FieldToday from "./pages/FieldToday.jsx";
import FieldCard from "./pages/FieldCard.jsx";
import OfficePipeline from "./pages/OfficePipeline.jsx";
import OwnerPlanning from "./pages/OwnerPlanning.jsx";
import Clients from "./pages/Clients.jsx";
import Projects from "./pages/Projects.jsx";
import OwnerCardDetails from "./pages/OwnerCardDetails.jsx";
import ClientView from "./pages/ClientView.jsx";
import { Link } from "react-router-dom";

export default function App() {
  return (
    <>
      <nav className="top-nav">
        <Link to="/field/today">Field Today</Link>
        <Link to="/office/pipeline">Pipeline</Link>
        <Link to="/office/planning">Planning</Link>
        <Link to="/office/clients">Clients</Link>
        <Link to="/office/projects">Projects</Link>
      </nav>

      <Routes>
        <Route path="/" element={<FieldToday />} />
        <Route path="/field/today" element={<FieldToday />} />
        <Route path="/field/card/:id" element={<FieldCard />} />
        <Route path="/office/pipeline" element={<OfficePipeline />} />
        <Route path="/office/planning" element={<OwnerPlanning />} />
        <Route path="/office/clients" element={<Clients />} />
        <Route path="/office/projects" element={<Projects />} />
        <Route path="/office/card/:id" element={<OwnerCardDetails />} />
        <Route path="/office/client/:id" element={<ClientView />} />
      </Routes>
    </>
  );
}
