import Head from 'next/head';
import Link from 'next/link';
import { getAllPosts } from '../../lib/posts';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

export default function Blog({ allPosts }) {
  return (
    <>
      <Head>
        <title>Blog CLT ou PJ | Dicas e Guias Completo</title>
        <meta name="description" content="Guias completos sobre CLT vs PJ. Saiba quanto ganhar, como abrir CNPJ, impostos e dicas para freelancers." />
        <meta name="keywords" content="blog clt pj, guia clt pj, dicas pj, abrir cnpj, simples nacional" />
        <link rel="canonical" href="https://calculadora-cltvspj.vercel.app/blog" />
      </Head>

      <div className="page-root">
        {/* Header */}
        <header className="site-header">
          <Link href="/" className="header-back">
            <span>← Calculadora</span>
          </Link>
          <span className="header-brand">CLT ou PJ?</span>
          <div style={{ width: '96px' }}></div>
        </header>

        {/* Blog Container */}
        <div className="blog-container">
          <header className="blog-header">
            <span className="blog-header-badge">📚 Base de Conhecimento</span>
            <h1>Blog CLT ou PJ</h1>
            <p>Tudo que você precisa saber para tomar a melhor decisão de carreira e tributação no Brasil.</p>
          </header>

          {/* Posts Grid */}
          <div className="posts-grid">
            {allPosts.map((post) => (
              <article key={post.slug} className="post-card">
                <div className="post-meta">
                  <div className="post-tag">
                    <Clock size={12} />
                    {post.readingTime || "5 min"}
                  </div>
                  <div className="post-reading-time">
                    {new Date(post.date).toLocaleDateString('pt-BR')}
                  </div>
                </div>

                <h2 className="post-card h2">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>

                <p className="post-description">
                  {post.excerpt}
                </p>

                <div className="post-meta">
                  {post.tags?.map((tag) => (
                    <span key={tag} className="post-tag">
                      {tag}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/blog/${post.slug}`}
                  className="read-more"
                >
                  Ler artigo <span>→</span>
                </Link>
              </article>
            ))}
          </div>

          {/* CTA Banner */}
          <div className="cta-banner">
            <h2 className="cta-banner h2">Pronto para calcular?</h2>
            <p className="cta-banner p">
              Use nossa calculadora gratuita para comparar CLT vs PJ em segundos
            </p>
            <Link
              href="/"
              className="cta-button"
            >
              Usar Calculadora Gratuita
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const allPosts = await getAllPosts();
  return {
    props: {
      allPosts,
    },
  };
}
