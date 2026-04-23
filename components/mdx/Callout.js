export default function Callout({ label, type = 'default', children }) {
  const isHot = type === 'hot';
  return (
    <div className={`callout ${isHot ? 'callout-hot' : ''}`}>
      {label && <span className="callout-label">{label}</span>}
      <p className="callout-text">{children}</p>
    </div>
  );
}