import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { api } from "../api/client.js";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: ""
  });

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const res = await api.get("/clients");
    setClients(res.data);
  }

  async function addClient() {
    if (!newClient.name.trim()) return;
    await api.post("/clients", newClient);
    window.__toast?.success?.("Client added");
    setNewClient({ name: "", phone: "", email: "", address: "", notes: "" });
    load();
  }

  function handleEdit(id, field, value) {
    setClients(prev =>
      prev.map(c => (c.id === id ? { ...c, [field]: value } : c))
    );
  }

  async function saveClient(id) {
    const client = clients.find(c => c.id === id);
    if (!client) return;
    await api.put(`/clients/${id}`, {
      name: client.name,
      phone: client.phone,
      email: client.email,
      address: client.address,
      notes: client.notes
    });
    window.__toast?.success?.("Client saved");
    load();
  }

  async function deleteClient(id) {
    await api.delete(`/clients/${id}`);
    window.__toast?.info?.("Client deleted");
    load();
  }

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
        <button className="btn btn-primary" onClick={addClient}>
          + Add Client
        </button>
      </div>

      <div className="card" style={{ display: "grid", gap: 8 }}>
        <input
          placeholder="Name *"
          value={newClient.name}
          onChange={e => setNewClient({ ...newClient, name: e.target.value })}
          required
        />
        <input
          placeholder="Phone"
          value={newClient.phone}
          onChange={e => setNewClient({ ...newClient, phone: e.target.value })}
        />
        <input
          placeholder="Email"
          type="email"
          value={newClient.email}
          onChange={e => setNewClient({ ...newClient, email: e.target.value })}
        />
        <input
          placeholder="Address"
          value={newClient.address}
          onChange={e => setNewClient({ ...newClient, address: e.target.value })}
        />
        <textarea
          placeholder="Notes"
          value={newClient.notes}
          onChange={e => setNewClient({ ...newClient, notes: e.target.value })}
          rows={3}
        />
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Address</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(c => (
              <tr key={c.id}>
                <td>
                  <Link to={`/office/client/${c.id}`}>{c.name}</Link>
                </td>
                <td>
                  <input
                    value={c.phone || ""}
                    onChange={e => handleEdit(c.id, "phone", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    value={c.email || ""}
                    onChange={e => handleEdit(c.id, "email", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    value={c.address || ""}
                    onChange={e => handleEdit(c.id, "address", e.target.value)}
                  />
                </td>
                <td>
                  <textarea
                    value={c.notes || ""}
                    onChange={e => handleEdit(c.id, "notes", e.target.value)}
                    rows={2}
                  />
                </td>
                <td style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <button onClick={() => saveClient(c.id)}>Save</button>
                  <button onClick={() => deleteClient(c.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
