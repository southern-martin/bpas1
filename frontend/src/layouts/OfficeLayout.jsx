import { useEffect } from "react";
import Sidebar from "../components/Sidebar.jsx";
import { runSync } from "../offline/sync.js";
import { useSyncStatus } from "../offline/syncStatus.js";

export default function OfficeLayout({ children }) {
  const { status, lastSync } = useSyncStatus();

  useEffect(() => {
    const interval = setInterval(() => {
      runSync();
    }, 3 * 60 * 1000); // every 3 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ marginLeft: 220, width: "100%" }} className="page">
        <div style={{ marginBottom: 10 }}>
          {status === "syncing" && <span>🟡 Syncing…</span>}
          {status === "ok" && (
            <span>
              🟢 Synced {lastSync ? timeAgo(lastSync) : ""}
            </span>
          )}
          {status === "error" && <span>🔴 Sync Error</span>}
        </div>
        {children}
      </div>
    </div>
  );
}

function timeAgo(ts) {
  const mins = Math.floor((Date.now() - ts) / 60000);
  return `${mins} min ago`;
}
