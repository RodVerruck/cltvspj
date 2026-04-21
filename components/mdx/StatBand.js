export default function StatBand({ num = "§ 01", stat, label, desc }) {
  return (
    <section className="band-breakout band-stat">
      <div className="band-inner band-stat-inner">
        <div>
          <div className="stat-section-num">{num}</div>
          <div className="stat-number">{stat}</div>
          <div className="stat-label">{label}</div>
        </div>
        <div>
          <div className="stat-desc">{desc}</div>
        </div>
      </div>
    </section>
  );
}