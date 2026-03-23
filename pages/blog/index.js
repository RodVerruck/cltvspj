import Head from 'next/head';
import Link from 'next/link';
import { getAllPosts } from '../../lib/posts';
import { Clock } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import AdSense from '../../components/AdSense';
import { SITE_URL } from '../../lib/config';

export default function Blog({ allPosts }) {
  return (
    <>
      <Head>
        <title>Blog CLT ou PJ | Dicas e Guias Completo</title>
        <meta name="description" content="Guias completos sobre CLT vs PJ. Saiba quanto ganhar, como abrir CNPJ, impostos e dicas para freelancers." />
        <meta name="keywords" content="blog clt pj, guia clt pj, dicas pj, abrir cnpj, simples nacional" />
        <link rel="canonical" href={`${SITE_URL}/blog`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/blog`} />
        <meta property="og:title" content="Blog CLT ou PJ | Dicas e Guias Completo" />
        <meta property="og:description" content="Guias completos sobre CLT vs PJ. Saiba quanto ganhar, como abrir CNPJ, impostos e dicas para freelancers." />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={`${SITE_URL}/og-image.png`} />
      </Head>

      <div className="page-root">
        <Header />

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

                <h2 className="post-card-title">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>

                <p className="post-description">
                  {post.description}
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
            <h2 className="cta-banner-title">Pronto para calcular?</h2>
            <p className="cta-banner-desc">
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
        <Footer />
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
