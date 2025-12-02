export function ClientEditForm({ form, saving, onChange, onSubmit, onCancel }) {
  const handleChange = e => {
    const { name, value } = e.target;
    onChange?.(name, value);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 bg-white p-4 rounded shadow">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input name="name" type="text" required value={form.name} onChange={handleChange} className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="block text-sm font-medium">Phone</label>
        <input name="phone" type="text" value={form.phone} onChange={handleChange} className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="block text-sm font-medium">Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="block text-sm font-medium">Address</label>
        <input name="address" type="text" value={form.address} onChange={handleChange} className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="block text-sm font-medium">Notes</label>
        <textarea name="notes" rows={3} value={form.notes} onChange={handleChange} className="w-full border p-2 rounded" />
      </div>

      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">
          Cancel
        </button>

        <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
