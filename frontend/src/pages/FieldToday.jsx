import { Navigate } from "react-router-dom";
import { FieldTodayView, useFieldToday } from "../features/field/index.js";

export default function FieldToday() {
  const {
    state: { events, tasks, deferredPrompt, showInstall, offline, pendingCount, lastSync },
    actions: { setShowInstall, handleSyncNow }
  } = useFieldToday();

  if (localStorage.getItem("role") !== "Staff") {
    return <Navigate to="/login" replace />;
  }

  return (
    <FieldTodayView
      events={events}
      tasks={tasks}
      offline={offline}
      pendingCount={pendingCount}
      lastSync={lastSync}
      showInstall={showInstall}
      deferredPrompt={deferredPrompt}
      setShowInstall={setShowInstall}
      handleSyncNow={handleSyncNow}
    />
  );
}
