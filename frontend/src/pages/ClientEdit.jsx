import { useEffect, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { api } from "../api/client.js";

export default function ClientEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadClient() {
    try {
      const res = await api.get(`/clients/${id}`);
      const data = res.data;
      setForm({
        name: data.name || "",
        phone: data.phone || "",
        email: data.email || "",
        address: data.address || "",
        notes: data.notes || ""
      });
    } catch (err) {
      console.error("Failed to load client:", err);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadClient();
  }, [id]);

  function updateField(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/clients/${id}`, form);
      navigate(`/office/client/${id}`);
    } catch (err) {
      console.error("Update client failed:", err);
      setSaving(false);
      alert("Failed to update client");
    }
  }

  if (localStorage.getItem("role") !== "Owner") {
    return <Navigate to="/login" replace />;
  }

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold mb-4">Edit Client</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            name="name"
            type="text"
            required
            value={form.name}
            onChange={updateField}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Phone</label>
          <input
            name="phone"
            type="text"
            value={form.phone}
            onChange={updateField}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={updateField}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Address</label>
          <input
            name="address"
            type="text"
            value={form.address}
            onChange={updateField}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Notes</label>
          <textarea
            name="notes"
            rows={3}
            value={form.notes}
            onChange={updateField}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={() => navigate(`/office/client/${id}`)}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
