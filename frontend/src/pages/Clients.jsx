import { useEffect, useState } from "react";
import { api } from "../api/client.js";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const res = await api.get("/clients");
    setClients(res.data);
  }

  async function addClient() {
    if (!newName.trim()) return;
    await api.post("/clients", { name: newName });
    setNewName("");
    load();
  }

  async function updateClient(id, name) {
    await api.patch(`/clients/${id}`, { name });
    load();
  }

  async function deleteClient(id) {
    await api.delete(`/clients/${id}`);
    load();
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Clients</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="New client name"
          value={newName}
          onChange={e => setNewName(e.target.value)}
        />
        <button onClick={addClient} style={{ marginLeft: 8 }}>
          Add
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Client Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(c => (
            <tr key={c.id}>
              <td>
                <input value={c.name} onChange={e => updateClient(c.id, e.target.value)} />
              </td>
              <td>
                <button onClick={() => deleteClient(c.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
