export default function QuoteBand({ quote, author }) {
  return (
    <section className="editorial-breakout py-24 px-8 md:px-16 bg-[#1a1614] text-[#f5f1e8]">
      <div className="text-center max-w-4xl mx-auto">
        <span className="font-display text-7xl text-[#f5f1e8]/20 leading-none block mb-8">&ldquo;</span>
        <blockquote className="font-display text-3xl md:text-5xl text-[#f5f1e8] leading-[1.1] mb-10 tracking-tight italic">
          {quote}
        </blockquote>
        {author && <div className="font-mono text-xs uppercase tracking-[0.3em] text-[#f5f1e8]/50 font-bold">{author}</div>}
      </div>
    </section>
  );
}