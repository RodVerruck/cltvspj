import Head from 'next/head';
import Link from 'next/link';
import { getAllPosts, getPostBySlug } from '../../../lib/posts';
import { Calendar, Clock, ArrowLeft, ArrowRight, Calculator, Users } from 'lucide-react';


export default function Post({ post }) {
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
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
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
          {/* Breadcrumb */}
          <div className="breadcrumb">
            <Link href="/blog">Blog</Link> / <span>{post.title}</span>
          </div>

          {/* Post Header */}
          <div className="post-header">
            <div className="post-meta">
              <div className="post-tag">
                <Calendar size={12} />
                {new Date(post.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <div className="post-reading-time">
                <Clock size={12} />
                {post.readingTime || "5 min"} de leitura
              </div>
            </div>

            <h1 className="post-header h1">
              {post.title}
            </h1>

            <p className="post-header post-description">
              {post.excerpt}
            </p>

            <div className="post-meta">
              {post.tags?.map((tag) => (
                <span key={tag} className="post-tag">
                  #{tag}
                </span>
              ))}
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
              <p>A Contsign cuida de toda a burocracia para você focar no que realmente importa: seu trabalho.</p>
              <a
                href="https://contsign.com.br/torne-se-um-afiliado/"
                target="_blank"
                rel="noopener noreferrer"
                className="affiliate-button"
              >
                Abrir Contador PJ →
              </a>
              <small>*Parceria afiliada - ganhamos comissão, você não paga nada extra</small>
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
          <div className="related-posts">
            <div className="post-card">
              <h2>CLT ou PJ: Qual Vale Mais?</h2>
              <p className="post-description">Descubra qual regime compensa mais para seu perfil profissional</p>
              <Link href="/blog/clt-ou-pj-qual-vale-mais" className="read-more">
                Ler mais →
              </Link>
            </div>
            <div className="post-card">
              <h2>Como Calcular Salário PJ</h2>
              <p className="post-description">Guia completo para definir seu valor hora como PJ</p>
              <Link href="/blog/como-calcular-salario-pj" className="read-more">
                Ler mais →
              </Link>
            </div>
          </div>
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

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
  };
}
