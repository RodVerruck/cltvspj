import Head from 'next/head';
import Link from 'next/link';
import { getAllPosts } from '../../lib/posts';
import { buildBlogFeed } from '../../lib/blog/feed';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PostCard from '../../components/blog/PostCard';
import { SITE_URL } from '../../lib/config';

export default function Blog({ feedItems, comparativoCount, articleCount }) {
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

        <section className="border-b border-rule py-16 md:py-24 relative">
          <div className="absolute inset-0 opacity-[0.07] pointer-events-none bg-grid-pattern" />
          <div className="max-w-6xl mx-auto px-6 md:px-8 relative">
            <div className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-muted mb-6 flex items-center gap-2">
              <span className="eyebrow-dot" />
              Base de conhecimento · {articleCount} guias · {comparativoCount} comparativos
            </div>
            <h1
              className="font-display leading-[0.9] tracking-[-0.04em] text-ink mb-6"
              style={{ fontSize: 'clamp(52px, 8vw, 96px)' }}
            >
              Artigos & <em className="italic text-money">Guias</em>.
            </h1>
            <p className="text-lg text-ink-muted leading-relaxed max-w-[52ch]">
              Análises objetivas sobre CLT, PJ e simulações por faixa salarial.
              Sem enrolação, com cálculos reais.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-20 border-b border-rule">
          <div className="max-w-6xl mx-auto px-6 md:px-8">
            <div className="flex flex-col md:flex-row md:items-baseline gap-5 mb-10 pb-5 border-b border-rule">
              <span className="font-mono text-xs text-ink-muted tracking-wide">§ 01</span>
              <h2 className="font-display text-3xl md:text-4xl text-ink tracking-editorial font-normal">
                Todos os conteúdos
              </h2>
              <Link
                href="/blog/comparativos"
                className="font-mono text-xs text-money md:ml-auto hover:underline underline-offset-4"
              >
                Ver só comparativos →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {feedItems.map((item, index) => (
                <PostCard key={item.id} post={item} index={index} featured={index === 0} />
              ))}
            </div>
          </div>
        </section>

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
                  className="inline-flex items-center gap-2 bg-paper text-money hover:bg-hot hover:text-paper px-6 py-3 rounded font-mono text-xs uppercase tracking-widest transition-all font-medium mb-3"
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
  const mdxPosts = await getAllPosts();
  const feedItems = buildBlogFeed(mdxPosts);
  const comparativoCount = feedItems.filter((item) => item.kind === 'comparativo').length;
  const articleCount = feedItems.filter((item) => item.kind === 'article').length;

  return {
    props: {
      feedItems,
      comparativoCount,
      articleCount,
    },
  };
}
