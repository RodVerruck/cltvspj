export default function InfoCard({ title, children }) {
  return (
    <div className="callout">
      <span className="callout-label">{title}</span>
      <p className="callout-text">{children}</p>
    </div>
  );
}