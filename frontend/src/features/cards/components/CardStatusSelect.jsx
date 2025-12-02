export function CardStatusSelect({ value, options, onChange }) {
  return (
    <div style={{ marginTop: 10 }}>
      <strong>Status:</strong>
      <select style={{ marginLeft: 8 }} value={value} onChange={e => onChange?.(e.target.value)}>
        {options.map(status => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </div>
  );
}
