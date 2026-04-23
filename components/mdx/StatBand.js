export default function StatBand({ num, stat, label, desc }) {
  return (
    <section className="band-breakout band-stat">
      <div className="band-inner band-stat-inner">
        <div>
          {num && <div className="stat-section-num">{num}</div>}
          <div className="stat-number">{stat}</div>
          {label && <div className="stat-label">{label}</div>}
        </div>
        <div>
          <p className="stat-desc">{desc}</p>
        </div>
      </div>
    </section>
  );
}