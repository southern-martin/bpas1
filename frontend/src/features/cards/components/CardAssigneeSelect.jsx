export function CardAssigneeSelect({ staff, value, onChange }) {
  return (
    <div style={{ marginTop: 20 }}>
      <h2>Assigned Staff</h2>
      <select className="select-staff" value={value || ""} onChange={e => onChange?.(e.target.value || null)}>
        <option value="">Unassigned</option>
        {staff.map(s => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
    </div>
  );
}
