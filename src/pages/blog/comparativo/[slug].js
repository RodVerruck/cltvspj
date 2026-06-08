import Link from 'next/link';
import { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import PostSEO from '../../../components/seo/PostSEO';
import ComparativoBody from '../../../components/comparativo/ComparativoBody';
import RelatedCards from '../../../components/blog/RelatedCards';
import {
  getAllComparativoConfigs,
  getComparativoBySlug,
  getRelatedComparativos,
} from '../../../lib/comparativo/catalog';

export default function ComparativoPage({ scenario, related }) {
  const {
    title,
    description,
    slug,
    date,
    tags,
    author,
    readingTime,
    seriesLabel,
  } = scenario;

  const [readingProgress, setReadingProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('');
  const [tableOfContents, setTableOfContents] = useState([]);

  const seoPost = { slug, title, description, date, tags, author };

  useEffect(() => {
    const h2Elements = document.querySelectorAll('.post-content h2');
    const toc = [];

    h2Elements.forEach((h2) => {
      if (!h2.id) {
        h2.id = h2.innerText
          .toLowerCase()
          .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');
      }
      toc.push({ id: h2.id, title: h2.innerText });
    });

    setTableOfContents(toc);

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
  }, [slug]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const relatedCards = related.map((item) => ({
    slug: item.slug,
    title: item.title,
    description: item.description,
    date: item.date,
    tags: item.tags,
    badge: item.seriesLabel || 'Comparativo',
    kind: 'comparativo',
    href: `/blog/comparativo/${item.slug}`,
  }));

  return (
    <>
      <PostSEO post={seoPost} section="comparativo" />

      <div className="reading-progress-bar" style={{ width: `${readingProgress}%` }} />

      <Header />

      <main className="bg-paper min-h-screen">
        <div className="border-b border-rule pt-28 pb-20 md:pt-36 md:pb-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-grid-pattern" />
          <div className="max-w-5xl mx-auto px-6 md:px-8 relative">
            <div className="flex flex-col items-center gap-6 mb-10">
              <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-money font-black flex items-center gap-3 flex-wrap justify-center">
                <Link href="/blog" className="hover:underline underline-offset-4">Blog</Link>
                <span className="w-1.5 h-1.5 rounded-full bg-money/20" />
                <Link href="/blog/comparativos" className="hover:underline underline-offset-4">Comparativos</Link>
                <span className="w-1.5 h-1.5 rounded-full bg-money/20" />
                <span>{seriesLabel}</span>
              </div>
            </div>

            <h1
              className="font-display leading-[1.15] tracking-editorial text-ink text-center mb-10 font-bold mx-auto max-w-[850px]"
              style={{ fontSize: 'clamp(2.3rem, 6.5vw, 3.8rem)' }}
            >
              {title}
            </h1>

            <div className="max-w-2xl mx-auto mb-12 text-center">
              <p className="text-xl md:text-2xl text-ink-muted leading-relaxed font-serif italic">
                {description}
              </p>
            </div>

            <div className="flex items-center justify-center gap-10 pt-10 border-t border-rule/60 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-fade">
              <div className="flex items-center gap-2">
                <span>Publicado em</span>
                <span className="text-ink font-bold">{date}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Leitura</span>
                <span className="text-ink font-bold">{readingTime}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pb-32 pt-20">
          <div className="max-w-[1400px] mx-auto px-6 md:px-8 blog-layout-grid">
            <aside className="blog-toc-column">
              <div className="toc-sidebar">
                <span className="toc-title">Neste artigo</span>
                <nav className="flex flex-col gap-0">
                  {tableOfContents.map((section) => (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => scrollTo(section.id)}
                      className={`toc-link ${activeSection === section.id ? 'toc-link--active' : ''}`}
                    >
                      {section.title}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            <article className="post-content w-full mx-auto blog-content-column">
              <ComparativoBody scenario={{ ...scenario, related }} />
            </article>

            <aside className="blog-empty-column" />
          </div>
        </div>

        <RelatedCards items={relatedCards} hubHref="/blog/comparativos" />
      </main>

      <Footer />
    </>
  );
}

export async function getStaticPaths() {
  const configs = getAllComparativoConfigs();
  return {
    paths: configs.map((item) => ({ params: { slug: item.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const scenario = getComparativoBySlug(params.slug);
  if (!scenario) return { notFound: true };

  const related = getRelatedComparativos(params.slug, 4);

  return {
    props: {
      scenario,
      related,
    },
  };
}
