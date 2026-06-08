import Link from 'next/link';

export default function RelatedCards({ items, hubHref = '/blog' }) {
  if (!items?.length) return null;

  return (
    <div className="border-t border-rule py-32 bg-paper-dark/20">
      <div className="max-w-5xl mx-auto px-6 md:px-8">
        <div className="flex items-end justify-between mb-16">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-money font-black block mb-3">
              Leia também
            </span>
            <h3 className="font-display text-5xl tracking-tighter text-ink font-black italic">Mais conhecimento</h3>
          </div>
          <Link
            href={hubHref}
            className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink font-bold hover:text-money transition-colors underline underline-offset-8"
          >
            Ver todos
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {items.slice(0, 2).map((item, i) => {
            const href = item.href || (item.kind === 'comparativo'
              ? `/blog/comparativo/${item.slug}`
              : `/blog/${item.slug}`);

            return (
              <Link key={item.slug || item.id} href={href} className="related-card group bg-white">
                <div
                  className="w-full h-56 overflow-hidden relative border-b border-rule"
                  style={{
                    background: i === 0
                      ? 'linear-gradient(135deg, #0c4a3e 0%, #1a1614 100%)'
                      : 'linear-gradient(135deg, #c2410c 0%, #1a1614 100%)',
                  }}
                >
                  <span className="absolute inset-0 flex items-center justify-center font-display italic text-9xl text-paper/10 group-hover:scale-110 transition-transform duration-700">
                    {['§', '%'][i]}
                  </span>
                  <div className="absolute top-6 left-6">
                    <span className="bg-paper/20 backdrop-blur-md text-paper px-4 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest font-bold">
                      {item.badge || item.tags?.[0] || 'Artigo'}
                    </span>
                  </div>
                </div>
                <div className="p-10">
                  <div className="font-mono text-[11px] text-ink-fade tracking-[0.2em] mb-4 uppercase font-bold">
                    {item.date}
                  </div>
                  <h4 className="font-display text-3xl tracking-tight text-ink group-hover:text-money transition-colors leading-[1.1] mb-5 font-black italic">
                    {item.title}
                  </h4>
                  <p className="text-ink-muted line-clamp-2 leading-relaxed text-base opacity-75">
                    {item.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
