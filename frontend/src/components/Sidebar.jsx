import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const { pathname } = useLocation();

  const menu = [
    { label: "Dashboard", path: "/office/dashboard" },
    { label: "Pipeline", path: "/office/pipeline" },
    { label: "Planning", path: "/office/planning" },
    { label: "Clients", path: "/office/clients" },
    { label: "Projects", path: "/office/projects" },
    { label: "Create Card", path: "/office/create-card" }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-title">BPAS Office</div>
      <div className="sidebar-links">
        {menu.map(m => (
          <Link
            key={m.path}
            to={m.path}
            className={`sidebar-item ${pathname === m.path ? "active" : ""}`}
          >
            {m.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
