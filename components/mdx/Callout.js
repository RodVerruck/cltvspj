export default function Callout({ label, children }) {
  return (
    <div className="callout">
      <span className="callout-label">{label}</span>
      <p className="callout-text">{children}</p>
    </div>
  );
}