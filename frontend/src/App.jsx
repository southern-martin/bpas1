import { Routes, Route } from "react-router-dom";
import FieldToday from "./pages/FieldToday.jsx";
import FieldCard from "./pages/FieldCard.jsx";
import OfficePipeline from "./pages/OfficePipeline.jsx";
import OwnerPlanning from "./pages/OwnerPlanning.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<FieldToday />} />
      <Route path="/field/today" element={<FieldToday />} />
      <Route path="/field/card/:id" element={<FieldCard />} />
      <Route path="/office/pipeline" element={<OfficePipeline />} />
      <Route path="/office/planning" element={<OwnerPlanning />} />
    </Routes>
  );
}
