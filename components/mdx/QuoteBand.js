export default function QuoteBand({ quote, author }) {
  return (
    <section className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] py-20 bg-[#1a1614] text-[#f5f1e8]">
      <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
        <span className="font-serif text-6xl text-[#f5f1e8]/20 leading-none block mb-6">&ldquo;</span>
        <blockquote className="font-serif text-3xl md:text-4xl text-[#f5f1e8] leading-tight mb-6 max-w-prose mx-auto">
          {quote}
        </blockquote>
        {author && <div className="font-mono text-xs uppercase tracking-[0.2em] text-[#f5f1e8]/60">{author}</div>}
      </div>
    </section>
  );
}