import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getAllPosts, getPostBySlug } from '../../../lib/posts';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import AffiliateCTA from '../../../components/AffiliateCTA';
import PostContent from '../../../components/posts/PostContent';
import PostSEO from '../../../components/seo/PostSEO';

/* ─────────────────────────────────────────
   PÁGINA PRINCIPAL
   Refatorada para ser 100% genérica via MDX
   ───────────────────────────────────────── */
export default function Post({ post, relatedPosts }) {
  const [readingProgress, setReadingProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('');
  const [tableOfContents, setTableOfContents] = useState([]);

  useEffect(() => {
    // Client-side TOC generation: works for Markdown and embedded React components
    const h2Elements = document.querySelectorAll('.post-content h2');
    const toc = [];
    
    h2Elements.forEach((h2) => {
      if (!h2.id) {
        h2.id = h2.innerText
          .toLowerCase()
          .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');
      }
      toc.push({ id: h2.id, title: h2.innerText });
    });
    
    setTableOfContents(toc);

    // Scroll progress & active section tracking
    const onScroll = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setReadingProgress(Math.min((window.scrollY / docH) * 100, 100));

      let currentId = '';
      for (let i = toc.length - 1; i >= 0; i--) {
        const el = document.getElementById(toc[i].id);
        if (el && el.getBoundingClientRect().top <= 150) {
          currentId = toc[i].id;
          break;
        }
      }
      if (!currentId && toc.length > 0) {
        currentId = toc[0].id;
      }
      if (currentId) setActiveSection(currentId);
    };

    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [post.slug]);

  const scrollTo = id => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <PostSEO post={post} />

      {/* 1. Progress Bar - Fix Z-index and Visibility */}
      <div className="reading-progress-bar" style={{ width: `${readingProgress}%` }} />

      <Header />

      <main className="bg-paper min-h-screen">
        {/* 2. Hero Section - Fix H1 width and line-height */}
        <div className="border-b border-rule pt-28 pb-20 md:pt-36 md:pb-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-grid-pattern" />
          <div className="max-w-5xl mx-auto px-6 md:px-8 relative">

            {/* Breadcrumb & Meta */}
            <div className="flex flex-col items-center gap-6 mb-10">
              <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-money font-black flex items-center gap-3">
                <Link href="/blog" className="hover:underline underline-offset-4">Blog</Link>
                <span className="w-1.5 h-1.5 rounded-full bg-money/20" />
                <span>{post.tags?.[0] || 'Artigo'}</span>
              </div>
            </div>

            {/* Título de Impacto - Limit width and center with clear typography */}
            <h1 className="font-display leading-[1.15] tracking-editorial text-ink text-center mb-10 font-bold mx-auto max-w-[850px]"
              style={{ fontSize: 'clamp(2.3rem, 6.5vw, 3.8rem)' }}>
              {post.title}
            </h1>

            {/* Linha de Impacto (Lead) */}
            <div className="max-w-2xl mx-auto mb-12 text-center">
              <p className="text-xl md:text-2xl text-ink-muted leading-relaxed font-serif italic">
                {post.description}
              </p>
            </div>

            {/* Meta informações reformuladas */}
            <div className="flex items-center justify-center gap-10 pt-10 border-t border-rule/60
                            font-mono text-[10px] uppercase tracking-[0.2em] text-ink-fade">
              <div className="flex items-center gap-2">
                <span>Publicado em</span>
                <span className="text-ink font-bold">{post.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Leitura</span>
                <span className="text-ink font-bold">{post.readingTime || '5 min'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Layout com TOC Sidebar */}
        <div className="pb-32 pt-20">
          <div className="max-w-[1400px] mx-auto px-6 md:px-8 blog-layout-grid">

            {/* Sidebar Esquerda: TOC Sticky */}
            <aside className="blog-toc-column">
              <div className="toc-sidebar">
                <span className="toc-title">Neste artigo</span>
                <nav className="flex flex-col gap-0">
                  {tableOfContents.map(section => (
                    <button
                      key={section.id}
                      onClick={() => scrollTo(section.id)}
                      className={`toc-link ${activeSection === section.id ? 'toc-link--active' : ''}`}
                    >
                      {section.title}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Coluna Central: Conteúdo (max-width rigoroso) */}
            <article className="post-content w-full mx-auto blog-content-column">
              <PostContent content={post.mdxSource} />

              <div className="mt-24">
                <AffiliateCTA
                  partner="manasses"
                  title="Planejamento contábil especializado para TI."
                  description="A Manassés Contabilidade cuida da contabilidade mensal da sua empresa com suporte humanizado e 50% de desconto na primeira mensalidade."
                  buttonText="Conhecer a Manassés"
                />
              </div>
            </article>

            {/* Sidebar Direita: Vazio (para equilibrar visualmente) */}
            <aside className="blog-empty-column" />

          </div>
        </div>

        {/* 4. Posts Relacionados com Cards Maiores */}
        {relatedPosts && relatedPosts.length > 0 && (
          <div className="border-t border-rule py-32 bg-paper-dark/20">
            <div className="max-w-5xl mx-auto px-6 md:px-8">
              <div className="flex items-end justify-between mb-16">
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-money font-black block mb-3">Leia também</span>
                  <h3 className="font-display text-5xl tracking-tighter text-ink font-black italic">Mais conhecimento</h3>
                </div>
                <Link href="/blog" className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink font-bold hover:text-money transition-colors underline underline-offset-8">Ver todos os posts</Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {relatedPosts.slice(0, 2).map((p, i) => (
                  <Link key={p.slug} href={`/blog/${p.slug}`} className="related-card group bg-white">
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
                          {p.tags?.[0] || 'Artigo'}
                        </span>
                      </div>
                    </div>
                    <div className="p-10">
                      <div className="font-mono text-[11px] text-ink-fade tracking-[0.2em] mb-4 uppercase font-bold">
                        {p.date}
                      </div>
                      <h4 className="font-display text-3xl tracking-tight text-ink group-hover:text-money transition-colors leading-[1.1] mb-5 font-black italic">
                        {p.title}
                      </h4>
                      <p className="text-ink-muted line-clamp-2 leading-relaxed text-base opacity-75">
                        {p.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}

export async function getStaticPaths() {
  const posts = await getAllPosts();
  return {
    paths: posts.map(post => ({ params: { slug: post.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const post = await getPostBySlug(params.slug);
  const allPosts = await getAllPosts();

  let relatedPosts = [];
  if (post?.tags?.length) {
    const withSharedTags = allPosts.filter(p =>
      p.slug !== params.slug &&
      p.tags?.some(tag => post.tags.includes(tag))
    );
    relatedPosts = withSharedTags.slice(0, 3);
  }

  if (relatedPosts.length === 0) {
    relatedPosts = allPosts.filter(p => p.slug !== params.slug).slice(0, 3);
  }

  if (!post) return { notFound: true };
  return { props: { post, relatedPosts } };
}