export function CardLinkSelector({ label, value, options, onChange, renderLabel }) {
  return (
    <div style={{ marginTop: 20 }}>
      <h2>{label}</h2>
      <div style={{ marginBottom: 6 }}>{renderLabel?.(value) || (value || "None")}</div>
      <select value={value || ""} onChange={e => onChange?.(e.target.value || null)}>
        <option value="">None</option>
        {options.map(option => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}
