import Head from 'next/head';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { SITE_URL } from '../../../lib/config';
import { getAllComparativos } from '../../../lib/comparativo/catalog';
import { formatBRLShort } from '../../../lib/comparativo/format';

export default function ComparativosHub({ comparativos, salaryBands, caseStudies }) {
  return (
    <>
      <Head>
        <title>Comparativos CLT vs PJ por Salário | CLT vs PJ</title>
        <meta
          name="description"
          content="Simulações CLT vs PJ por faixa salarial e estudos de caso. CLT 3.000, 5.000, 8.000, 10.000 e mais — números reais com impostos 2026."
        />
        <link rel="canonical" href={`${SITE_URL}/blog/comparativos`} />
      </Head>

      <div className="page-root">
        <Header />

        <section className="border-b border-rule py-16 md:py-24 relative">
          <div className="absolute inset-0 opacity-[0.07] pointer-events-none bg-grid-pattern" />
          <div className="max-w-6xl mx-auto px-6 md:px-8 relative">
            <div className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-muted mb-6 flex items-center gap-2">
              <Link href="/blog" className="text-money hover:underline">Blog</Link>
              <span>·</span>
              <span>Comparativos</span>
            </div>
            <h1
              className="font-display leading-[0.95] tracking-editorial text-ink mb-6"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}
            >
              CLT vs PJ por <em className="italic text-money">faixa salarial</em>
            </h1>
            <p className="text-lg text-ink-muted leading-relaxed max-w-[52ch]">
              Páginas de cauda longa com simulações reais da nossa calculadora.
              Escolha sua faixa ou estudo de caso — depois ajuste os números na{' '}
              <Link href="/" className="text-money font-semibold hover:underline">calculadora completa</Link>.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-20 border-b border-rule">
          <div className="max-w-6xl mx-auto px-6 md:px-8">
            <h2 className="font-display text-3xl text-ink mb-8">Faixas salariais CLT</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {salaryBands.map((item) => (
                <Link
                  key={item.slug}
                  href={`/blog/comparativo/${item.slug}`}
                  className="group block p-6 border border-rule rounded-lg bg-surface hover:border-money hover:-translate-y-0.5 transition-all"
                >
                  <span className="font-mono text-[10px] uppercase tracking-widest text-money">Faixa CLT</span>
                  <p className="font-display text-2xl text-ink group-hover:text-money mt-2">
                    R$ {formatBRLShort(item.cltGross)}
                  </p>
                  <p className="text-sm text-ink-muted mt-2 line-clamp-2">{item.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-6 md:px-8">
            <h2 className="font-display text-3xl text-ink mb-8">Estudos de caso</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {caseStudies.map((item) => (
                <Link
                  key={item.slug}
                  href={`/blog/comparativo/${item.slug}`}
                  className="group block p-6 border border-rule rounded-lg bg-surface hover:border-hot hover:-translate-y-0.5 transition-all"
                >
                  <span className="font-mono text-[10px] uppercase tracking-widest text-hot">Estudo de caso</span>
                  <p className="font-display text-xl text-ink group-hover:text-hot mt-2">{item.title}</p>
                  <p className="text-sm text-ink-muted mt-2">{item.description}</p>
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
  const comparativos = getAllComparativos();
  const salaryBands = comparativos.filter((item) => item.type === 'salary-band');
  const caseStudies = comparativos.filter((item) => item.type === 'case-study');

  return {
    props: {
      comparativos,
      salaryBands,
      caseStudies,
    },
  };
}
