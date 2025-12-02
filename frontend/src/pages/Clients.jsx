import { Navigate } from "react-router-dom";
import {
  ClientQuickAddForm,
  ClientsTable,
  useClients
} from "../features/clients/index.js";

export default function Clients() {
  const {
    clients,
    newClient,
    setNewClient,
    loading,
    page,
    totalPages,
    pageData,
    setPage,
    saveNewClient,
    inlineUpdate,
    saveInlineClient,
    removeClient
  } = useClients();

  if (localStorage.getItem("role") !== "Owner") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="page">
      <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0 }}>Clients</h1>
          <p className="small">Store full contact details for every client.</p>
        </div>
      </div>

      <ClientQuickAddForm value={newClient} onChange={setNewClient} onSubmit={saveNewClient} />

      {loading ? (
        <div className="card">Loading...</div>
      ) : (
        <>
          <ClientsTable
            clients={pageData}
            onChangeField={inlineUpdate}
            onSave={saveInlineClient}
            onDelete={removeClient}
          />

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
            <button className="btn btn-light" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
              Prev
            </button>
            <div style={{ alignSelf: "center" }}>
              Page {page} / {totalPages}
            </div>
            <button
              className="btn btn-light"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
