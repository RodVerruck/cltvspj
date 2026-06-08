import Link from 'next/link';

export default function PostCard({ post, index, featured }) {
  const symbols = ['§', 'R$', '%', '⅔', 'TI', '0%'];
  const sym = symbols[index % symbols.length];
  const href = post.href || `/blog/${post.slug}`;
  const isComparativo = post.kind === 'comparativo';

  if (featured) {
    return (
      <Link
        href={href}
        className="group relative md:col-span-2 lg:col-span-1 xl:col-span-2 block hover:-translate-y-1 hover:shadow-md transition-all duration-300"
      >
        <article className="flex flex-col md:flex-row rounded-lg overflow-hidden border border-rule bg-surface shadow-sm h-full">
          <span className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-money z-10" />
          <div
            className="w-full md:w-1/2 lg:w-2/5 min-h-[250px] md:min-h-full flex items-center justify-center relative overflow-hidden"
            style={{
              background: isComparativo
                ? 'linear-gradient(135deg, #c2410c 0%, #1a1614 100%)'
                : 'linear-gradient(135deg, var(--money) 0%, #1a1614 100%)',
            }}
          >
            <span className="font-display italic text-[80px] md:text-[100px] text-white/10 leading-none select-none absolute">
              {sym}
            </span>
          </div>
          <div className="w-full md:w-1/2 lg:w-3/5 p-6 md:p-8 flex flex-col justify-center">
            <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-muted mb-4 flex gap-3 flex-wrap">
              <span className="text-money bg-money-light px-2 py-1 rounded-sm text-[9px]">Destaque</span>
              {isComparativo && (
                <span className="text-hot bg-hot-light px-2 py-1 rounded-sm text-[9px]">Comparativo</span>
              )}
              <span>{post.readingTime || '5 min'}</span>
              <span className="text-ink-fade">·</span>
              <span>{new Date(post.date).toLocaleDateString('pt-BR')}</span>
            </div>
            <h2 className="font-display text-[clamp(1.5rem,2.5vw,2rem)] leading-[1.1] tracking-[-0.02em] text-ink mb-4 group-hover:text-money transition-colors text-balance">
              {post.title}
            </h2>
            <p className="text-sm text-ink-muted leading-relaxed mb-6 line-clamp-3">{post.description}</p>
            <div className="flex items-center gap-2 pt-4 border-t border-rule">
              <span className="font-mono text-[11px] text-money tracking-wide group-hover:translate-x-0.5 transition-transform">
                {isComparativo ? 'Ver simulação' : 'Ler artigo completo'}
              </span>
              <span className="text-money group-hover:translate-x-2 transition-transform duration-200">→</span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={href} className="group relative block hover:-translate-y-1 hover:shadow-md transition-all duration-300">
      <article className="flex flex-col rounded-lg overflow-hidden border border-rule bg-surface shadow-sm h-full">
        <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-money z-10" />
        <div
          className="h-48 flex items-center justify-center relative overflow-hidden"
          style={{
            background: isComparativo
              ? 'linear-gradient(135deg, #c2410c 0%, #1a1614 100%)'
              : index % 2 === 0
                ? 'linear-gradient(135deg, var(--money) 0%, #1a1614 100%)'
                : 'linear-gradient(135deg, #c2410c 0%, #1a1614 100%)',
          }}
        >
          <span className="font-display italic text-[60px] text-white/15 leading-none select-none">{sym}</span>
          {isComparativo && (
            <span className="absolute top-4 left-4 bg-paper/20 backdrop-blur-md text-paper px-3 py-1 rounded-full text-[9px] font-mono uppercase tracking-widest font-bold">
              Comparativo
            </span>
          )}
        </div>
        <div className="p-6 flex flex-col flex-1">
          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-muted mb-3 flex gap-2">
            <span>{post.badge || post.tags?.[0] || 'Artigo'}</span>
            <span className="text-ink-fade">·</span>
            <span>{post.readingTime || '5 min'}</span>
            <span className="text-ink-fade">·</span>
            <span>{new Date(post.date).toLocaleDateString('pt-BR')}</span>
          </div>
          <h3 className="font-display text-[clamp(1.1rem,2vw,1.25rem)] leading-[1.2] tracking-[-0.01em] text-ink mb-3 flex-1 group-hover:text-money transition-colors">
            {post.title}
          </h3>
          <p className="text-sm text-ink-muted leading-relaxed mb-5 line-clamp-3">{post.description}</p>
          <div className="flex items-center gap-2 pt-4 border-t border-rule mt-auto">
            <span className="font-mono text-[11px] text-money group-hover:translate-x-0.5 transition-transform">
              {isComparativo ? 'Ver simulação' : 'Ler mais'}
            </span>
            <span className="text-money group-hover:translate-x-2 transition-transform duration-200">→</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
