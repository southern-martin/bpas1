export function ClientQuickAddForm({ value, onChange, onSubmit }) {
  return (
    <div className="card" style={{ display: "grid", gap: 8 }}>
      <input placeholder="Name *" value={value.name} onChange={e => onChange({ ...value, name: e.target.value })} required />
      <input placeholder="Phone" value={value.phone} onChange={e => onChange({ ...value, phone: e.target.value })} />
      <input placeholder="Email" type="email" value={value.email} onChange={e => onChange({ ...value, email: e.target.value })} />
      <input placeholder="Address" value={value.address} onChange={e => onChange({ ...value, address: e.target.value })} />
      <textarea placeholder="Notes" value={value.notes} onChange={e => onChange({ ...value, notes: e.target.value })} rows={3} />
      <button className="btn btn-primary" onClick={onSubmit}>
        + Add Client
      </button>
    </div>
  );
}
