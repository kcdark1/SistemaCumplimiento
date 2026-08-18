export default function Kpi({ value, label, hint, tone }) {
  return (
    <div className={`kpi ${tone ? `kpi-${tone}` : ""}`}>
      <b>{value}</b>
      <span>{label}</span>
      {hint ? <small>{hint}</small> : null}
    </div>
  );
}
