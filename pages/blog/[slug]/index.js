import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getAllPosts, getPostBySlug } from '../../../lib/posts';
import { Calendar, Clock, ArrowLeft, ArrowRight, Calculator, Users, List, ChevronRight } from 'lucide-react';

export default function Post({ post, relatedPosts }) {
  const [readingProgress, setReadingProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('');

  // Sumário de seções do artigo
  const tableOfContents = [
    { id: 'o-que-e-o-simples-nacional', title: 'O que é o Simples Nacional?' },
    { id: 'os-anexos-do-simples-nacional', title: 'Os Anexos do Simples Nacional' },
    { id: 'como-saber-qual-anexo-e-o-seu', title: 'Como saber qual Anexo é o seu?' },
    { id: 'exemplo-de-calculo-real-por-profissao', title: 'Exemplo de cálculo real por profissão' },
    { id: 'como-o-imposto-e-calculado-na-pratica', title: 'Como o imposto é calculado na prática' },
    { id: 'simples-nacional-vs-lucro-presumido', title: 'Simples Nacional vs Lucro Presumido' },
    { id: 'resumo-o-que-voce-precisa-saber', title: 'Resumo: O que você precisa saber' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / documentHeight) * 100;
      setReadingProgress(Math.min(progress, 100));

      // Detectar seção ativa
      const sections = tableOfContents.map(section => ({
        ...section,
        element: document.getElementById(section.id)
      }));

      const currentSection = sections.find(section => {
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });

      if (currentSection) {
        setActiveSection(currentSection.id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  return (
    <>
      <Head>
        <title>{post.title} | Blog CLT ou PJ</title>
        <meta name="description" content={post.description} />
        <meta name="keywords" content={post.tags?.join(', ')} />
        <link rel="canonical" href={`https://calculadora-cltvspj.vercel.app/blog/${post.slug}`} />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="og:site_name" content="CLT ou PJ" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.description} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Fixed Progress Bar */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
          <div className="h-1 bg-blue-600 transition-all duration-300" style={{ width: `${readingProgress}%` }}></div>
        </div>

        {/* Header */}
        <header className="bg-white border-b border-gray-200 pt-1">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/blog" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition">
              <ArrowLeft size={20} />
              <span>Voltar ao Blog</span>
            </Link>
            <Link href="/" className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
              <Calculator size={16} />
              <span>Calculadora</span>
            </Link>
          </div>
        </header>

        {/* Post Container */}
        <div className="post-container">
          {/* Table of Contents */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <List size={18} className="text-blue-600" />
              <h3 className="font-semibold text-gray-900">Sumário do Artigo</h3>
            </div>
            <nav className="space-y-2">
              {tableOfContents.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full text-left flex items-center justify-between p-3 rounded-lg transition-colors ${activeSection === section.id
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                      : 'hover:bg-gray-50 text-gray-700 border-l-4 border-transparent'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-500 w-6">{index + 1}</span>
                    <span className="text-sm">{section.title}</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
              ))}
            </nav>
          </div>
          {/* Breadcrumb */}
          <div className="breadcrumb">
            <Link href="/blog">Blog</Link> / <span>{post.title}</span>
          </div>

          {/* Post Header */}
          <div className="post-header">
            <div className="post-meta">
              {post.tags?.map((tag) => (
                <span key={tag} className="post-tag">{tag}</span>
              ))}
              <span className="post-reading-time">⏱ {post.readingTime}</span>
            </div>

            <h1 className="post-header h1">
              {post.title}
            </h1>

            <p className="post-header post-description">
              {post.excerpt}
            </p>

            <div className="post-header-footer">
              <span className="post-author">✍️ {post.author || "Equipe CLT ou PJ"}</span>
              <span className="post-scroll-hint">↓ Continue lendo</span>
            </div>
          </div>

          {/* Article Content */}
          <article
            className="mdx-content"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />

          {/* Affiliate CTA */}
          <div className="affiliate-cta">
            <div className="affiliate-card">
              <h3>Precisa abrir seu CNPJ?</h3>
              <p>A Contasign cuida de toda a burocracia para você focar no que realmente importa: seu trabalho.</p>
              <a
                href="https://contasign.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="affiliate-button"
              >
                Abrir Contador PJ →
              </a>
            </div>
          </div>

          {/* Affiliate Disclaimer */}
          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-full">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs text-gray-600 font-medium">Parceria afiliada: ganhamos comissão, você não paga nada extra</span>
            </div>
          </div>

          {/* Calculator CTA */}
          <div className="calculator-cta">
            <h2>Pronto para calcular seu cenário?</h2>
            <p>Use nossa calculadora gratuita para comparar CLT vs PJ com base nos seus números reais</p>
            <Link
              href="/"
              className="cta-button"
            >
              <Calculator size={20} />
              Usar Calculadora Gratuita
            </Link>
          </div>

          {/* Related Posts */}
          {relatedPosts && relatedPosts.length > 0 && (
            <section className="related-posts">
              <h2 className="related-title">📖 Continue lendo</h2>
              <div className="related-grid">
                {relatedPosts.map((related) => (
                  <a key={related.slug} href={`/blog/${related.slug}`} className="related-card">
                    <div className="related-tags">
                      {related.tags?.slice(0, 1).map(tag => (
                        <span key={tag} className="post-tag">{tag}</span>
                      ))}
                    </div>
                    <h3>{related.title}</h3>
                    <span className="read-more">Ler artigo →</span>
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const posts = await getAllPosts();
  const paths = posts.map((post) => ({
    params: { slug: post.slug }
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const post = await getPostBySlug(params.slug);
  const allPosts = await getAllPosts();
  const relatedPosts = allPosts
    .filter(p => p.slug !== params.slug)
    .slice(0, 3);

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
      relatedPosts,
    },
  };
}
