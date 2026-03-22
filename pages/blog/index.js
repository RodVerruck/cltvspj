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

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition">
              <span>← Voltar</span>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Blog CLT ou PJ</h1>
          </div>
        </header>

        {/* Blog Container */}
        <div className="blog-container">
          <div className="blog-header">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Calendar size={16} />
              Guias e Artigos Especializados
            </div>

            <h1 className="blog-header h1">
              Domine o mundo <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">CLT e PJ</span>
            </h1>

            <p className="blog-header p">
              Guias completos, dicas práticas e tudo que você precisa saber para tomar as melhores decisões financeiras e profissionais.
            </p>
          </div>

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
                  Ler artigo completo →
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
  const allPosts = getAllPosts();
  return {
    props: {
      allPosts,
    },
  };
}
