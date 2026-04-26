export default function InfoCard({ title, type = 'default', children }) {
  const isHot = type === 'hot';
  return (
    <div className={`my-8 -mx-4 md:mx-0 ${isHot ? 'callout-hot' : ''}`}>
      <div className={`callout ${isHot ? 'callout-hot' : ''}`}>
        {title && <span className="callout-label">{title}</span>}
        <div className="callout-text">{children}</div>
      </div>
    </div>
  );
}