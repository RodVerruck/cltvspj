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
                  <div
                    className={`relative w-full mb-4 rounded overflow-hidden ${index === 0 ? 'h-64 md:h-80' : 'h-48'}`}
                    style={{
                      background: index % 3 === 0
                        ? 'linear-gradient(135deg, #0c4a3e 0%, #1a1614 100%)'
                        : index % 3 === 1
                          ? 'linear-gradient(135deg, #c2410c 0%, #1a1614 100%)'
                          : '#ebe5d6',
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        className={`font-display italic text-[120px] leading-none ${index % 3 === 2 ? 'text-ink/20' : 'text-paper/25'}`}
                      >
                        {['§', 'R$', '%'][index % 3]}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 font-mono text-xs text-ink-muted mb-2.5 tracking-wide">
                    <span>{post.readingTime || '5 min'}</span>
                    <span className="text-ink-fade">·</span>
                    <span>{new Date(post.date).toLocaleDateString('pt-BR')}</span>
                  </div>

                  <h3 className={`font-display tracking-editorial text-ink group-hover:text-money transition-colors mb-2.5 leading-tight ${index === 0 ? 'text-3xl md:text-4xl' : 'text-2xl'}`}>
                    {post.title}
                  </h3>

                  <p className={`text-ink-muted leading-relaxed ${index === 0 ? 'text-base' : 'text-sm'}`}>
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
