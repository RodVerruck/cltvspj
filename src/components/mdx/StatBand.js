export default function StatBand({ num, stat, label, desc }) {
  return (
    <section className="editorial-breakout py-16 px-8 md:px-12 bg-[#ebe5d6] border-y border-[#d4cdbe]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          {num && <div className="font-mono text-xs uppercase tracking-[0.2em] text-[#6b6357] mb-4">{num}</div>}
          <div className="font-display text-6xl md:text-8xl text-[#0c4a3e] leading-none tracking-tighter font-black">{stat}</div>
          {label && <div className="font-mono text-xs uppercase tracking-[0.15em] text-[#6b6357] mt-4">{label}</div>}
        </div>
        <div>
          <p className="font-display text-xl md:text-2xl text-[#1a1614] leading-relaxed italic">{desc}</p>
        </div>
      </div>
    </section>
  );
}