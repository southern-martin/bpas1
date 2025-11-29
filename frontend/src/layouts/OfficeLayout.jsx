import Sidebar from "../components/Sidebar.jsx";

export default function OfficeLayout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ marginLeft: 220, width: "100%" }} className="page">
        {children}
      </div>
    </div>
  );
}
