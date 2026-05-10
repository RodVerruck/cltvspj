export default function StatBand({ num, stat, label, desc }) {
  return (
    <section className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] py-16 bg-[#f5f1e8] border-y border-[#d4cdbe]">
      <div className="max-w-5xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div>
            {num && <div className="font-mono text-xs uppercase tracking-[0.12em] text-[#6b6357] mb-2">{num}</div>}
            <div className="font-serif text-5xl md:text-7xl text-[#0c4a3e] leading-tight">{stat}</div>
            {label && <div className="font-mono text-xs uppercase tracking-[0.15em] text-[#6b6357] mt-3">{label}</div>}
          </div>
          <div>
            <p className="font-serif text-xl md:text-2xl text-[#1a1614] leading-relaxed max-w-prose">{desc}</p>
          </div>
        </div>
      </div>
    </section>
  );
}