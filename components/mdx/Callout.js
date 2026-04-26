export default function Callout({ label, type = 'default', children }) {
  const isHot = type === 'hot';
  return (
    <div className="my-8 -mx-4 md:mx-0">
      <div className={`callout ${isHot ? 'callout-hot' : ''}`}>
        {label && <span className="callout-label">{label}</span>}
        <p className="callout-text">{children}</p>
      </div>
    </div>
  );
}