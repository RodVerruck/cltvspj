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

        <section className="border-b border-rule py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-6 md:px-8">
            <div className="section-head">
              <span className="section-num">§ 01</span>
              <h2 className="section-title">Artigos</h2>
              <p className="section-desc">Análises da decisão CLT vs PJ e do impacto das novas regras tributárias.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {allPosts.map((post, index) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className={`group block ${index === 0 ? 'md:col-span-2 lg:col-span-1' : ''}`}
                >
                  <div className="w-full h-48 rounded mb-4 relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-money to-ink">
                    <span className="font-display text-9xl text-white/20 italic leading-none">
                      {['§', 'R$', '%'][index % 3]}
                    </span>
                  </div>

                  <div className="font-mono text-xs uppercase text-ink-muted tracking-widest mb-2">
                    <span>{post.readingTime || '5 min'}</span>
                    <span className="text-ink-fade mx-2">·</span>
                    <span>{new Date(post.date).toLocaleDateString('pt-BR')}</span>
                  </div>

                  <h3 className="font-display text-2xl leading-tight text-ink hover:text-money transition-colors mb-2">
                    {post.title}
                  </h3>

                  <p className="text-sm text-ink-muted leading-relaxed">
                    {post.description}
                  </p>
                </Link>
              ))}
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
  return {
    props: {
      allPosts,
    },
  };
}
