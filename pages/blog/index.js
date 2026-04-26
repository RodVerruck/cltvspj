import Head from 'next/head';
import Link from 'next/link';
import { getAllPosts } from '../../lib/posts';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { SITE_URL } from '../../lib/config';

/* ── Card de post ── */
function PostCard({ post, index, featured }) {
  const symbols = ['§', 'R$', '%', '⅔', 'TI', '0%'];
  const sym = symbols[index % symbols.length];

  if (featured) {
    return (
      <Link href={`/blog/${post.slug}`}
        className="group relative md:col-span-2 lg:col-span-1 xl:col-span-2 
                   block hover:-translate-y-1 hover:shadow-md transition-all duration-300">
        <article className="flex flex-col md:flex-row rounded-lg overflow-hidden 
                         border border-rule bg-surface shadow-sm h-full">
          {/* Corner accent */}
          <span className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-money z-10" />

          {/* Image - Hero horizontal layout */}
          <div
            className="w-full md:w-1/2 lg:w-2/5 min-h-[250px] md:min-h-full flex items-center justify-center relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, var(--money) 0%, #1a1614 100%)' }}
          >
            <span className="font-display italic text-[80px] md:text-[100px] text-white/10 leading-none select-none absolute">
              {sym}
            </span>
          </div>

          {/* Content */}
          <div className="w-full md:w-1/2 lg:w-3/5 p-6 md:p-8 flex flex-col justify-center">
            <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-muted mb-4 flex gap-3">
              <span className="text-money bg-money-light px-2 py-1 rounded-sm text-[9px]">Destaque</span>
              <span>{post.readingTime || '5 min'}</span>
              <span className="text-ink-fade">·</span>
              <span>{new Date(post.date).toLocaleDateString('pt-BR')}</span>
            </div>
            <h2 className="font-display text-[clamp(1.5rem,2.5vw,2rem)] leading-[1.1] tracking-[-0.02em] text-ink mb-4
                           group-hover:text-money transition-colors text-balance">
              {post.title}
            </h2>
            <p className="text-sm text-ink-muted leading-relaxed mb-6 line-clamp-3">
              {post.description}
            </p>
            <div className="flex items-center gap-2 pt-4 border-t border-rule">
              <span className="font-mono text-[11px] text-money tracking-wide group-hover:translate-x-0.5 transition-transform">
                Ler artigo completo
              </span>
              <span className="text-money group-hover:translate-x-2 transition-transform duration-200">→</span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/blog/${post.slug}`}
      className="group relative block hover:-translate-y-1 hover:shadow-md transition-all duration-300">
      <article className="flex flex-col rounded-lg overflow-hidden 
                       border border-rule bg-surface shadow-sm h-full">
        {/* Corner accent */}
        <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-money z-10" />

        {/* Image thumbnail */}
        <div
          className="h-48 flex items-center justify-center relative overflow-hidden"
          style={{
            background: index % 2 === 0
              ? 'linear-gradient(135deg, var(--money) 0%, #1a1614 100%)'
              : 'linear-gradient(135deg, #c2410c 0%, #1a1614 100%)',
          }}
        >
          <span className="font-display italic text-[60px] text-white/15 leading-none select-none">
            {sym}
          </span>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-1">
          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-muted mb-3 flex gap-2">
            <span>{post.readingTime || '5 min'}</span>
            <span className="text-ink-fade">·</span>
            <span>{new Date(post.date).toLocaleDateString('pt-BR')}</span>
          </div>
          <h3 className="font-display text-[clamp(1.1rem,2vw,1.25rem)] leading-[1.2] tracking-[-0.01em]
                         text-ink mb-3 flex-1 group-hover:text-money transition-colors">
            {post.title}
          </h3>
          <p className="text-sm text-ink-muted leading-relaxed mb-5 line-clamp-3">
            {post.description}
          </p>
          <div className="flex items-center gap-2 pt-4 border-t border-rule mt-auto">
            <span className="font-mono text-[11px] text-money group-hover:translate-x-0.5 transition-transform">
              Ler mais
            </span>
            <span className="text-money group-hover:translate-x-2 transition-transform duration-200">→</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

/* ── Página ── */
export default function Blog({ allPosts }) {
  return (
    <>
      <Head>
        <title>Blog CLT ou PJ | Dicas e Guias Completo</title>
        <meta name="description" content="Guias completos sobre CLT vs PJ. Saiba quanto ganhar, como abrir CNPJ, impostos e dicas para freelancers." />
        <link rel="canonical" href={`${SITE_URL}/blog`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/blog`} />
        <meta property="og:title" content="Blog CLT ou PJ | Dicas e Guias Completo" />
        <meta property="og:description" content="Guias completos sobre CLT vs PJ." />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={`${SITE_URL}/og-image.png`} />
      </Head>

      <div className="page-root">
        <Header />

        {/* ── Hero ── */}
        <section className="border-b border-rule py-16 md:py-24 relative">
          <div className="absolute inset-0 opacity-[0.07] pointer-events-none bg-grid-pattern" />
          <div className="max-w-6xl mx-auto px-6 md:px-8 relative">
            <div className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-muted mb-6 flex items-center gap-2">
              <span className="eyebrow-dot" />
              Base de conhecimento · {allPosts.length} artigos
            </div>
            <h1 className="font-display leading-[0.9] tracking-[-0.04em] text-ink mb-6"
              style={{ fontSize: 'clamp(52px, 8vw, 96px)' }}>
              Artigos & <em className="italic text-money">Guias</em>.
            </h1>
            <p className="text-lg text-ink-muted leading-relaxed max-w-[52ch]">
              Análises objetivas sobre CLT, PJ e a decisão mais importante da sua carreira.
              Sem enrolação, com cálculos reais.
            </p>
          </div>
        </section>

        {/* ── Grid de artigos ── */}
        <section className="py-16 md:py-20 border-b border-rule">
          <div className="max-w-6xl mx-auto px-6 md:px-8">
            <div className="flex items-baseline gap-5 mb-10 pb-5 border-b border-rule">
              <span className="font-mono text-xs text-ink-muted tracking-wide">§ 01</span>
              <h2 className="font-display text-3xl md:text-4xl text-ink tracking-editorial font-normal">
                Todos os artigos
              </h2>
              <span className="font-mono text-xs text-ink-muted ml-auto">
                Ordenados por relevância
              </span>
            </div>

            {/* Grid de artigos com layout moderno */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {allPosts.map((post, index) => (
                <PostCard
                  key={post.slug}
                  post={post}
                  index={index}
                  featured={index === 0}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-16 md:py-20 bg-money text-paper">
          <div className="max-w-6xl mx-auto px-6 md:px-8">
            <div className="grid md:grid-cols-[1.3fr_1fr] gap-10 md:gap-16 items-center">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-paper/50 mb-4 block">
                  Ferramenta gratuita
                </span>
                <h3 className="font-display text-4xl md:text-[44px] leading-[1.05] tracking-editorial mb-4 font-normal">
                  Leu o suficiente.<br />Agora calcule o seu.
                </h3>
                <p className="text-base leading-relaxed text-paper/80 max-w-lg">
                  Nossa calculadora compara CLT e PJ com todos os descontos, benefícios
                  e a nova isenção de IR da Lei 15.270/2025.
                </p>
              </div>
              <div className="pl-0 md:pl-12 md:border-l border-paper/20">
                <a
                  href="/"
                  className="inline-flex items-center gap-2 bg-paper text-money
                             hover:bg-hot hover:text-paper px-6 py-3 rounded
                             font-mono text-xs uppercase tracking-widest
                             transition-all font-medium mb-3"
                >
                  Abrir a calculadora →
                </a>
                <p className="font-mono text-[11px] text-paper/40 italic">
                  Gratuita · resultado em 30 segundos
                </p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}

export async function getStaticProps() {
  const allPosts = await getAllPosts();
  return { props: { allPosts } };
}
