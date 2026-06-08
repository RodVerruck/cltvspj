import Head from 'next/head';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { SITE_URL } from '../../../lib/config';
import { getAllComparativos } from '../../../lib/comparativo/catalog';
import { formatBRLShort } from '../../../lib/comparativo/format';

export default function ComparativosHub({ salaryBands, caseStudies, professions }) {
  const total = salaryBands.length + caseStudies.length + professions.length;

  return (
    <>
      <Head>
        <title>Comparativos CLT vs PJ por Salário e Profissão | CLT vs PJ</title>
        <meta
          name="description"
          content={`${total} simulações CLT vs PJ: faixas de R$ 3.000 a R$ 30.000, estudos de caso e profissões de TI. Números reais com impostos 2026.`}
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
              <span>Hub de comparativos</span>
            </div>
            <h1
              className="font-display leading-[0.95] tracking-editorial text-ink mb-6"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}
            >
              {total} simulações <em className="italic text-money">CLT vs PJ</em>
            </h1>
            <p className="text-lg text-ink-muted leading-relaxed max-w-[52ch]">
              Escolha sua faixa salarial, estudo de caso ou profissão. Cada página traz cenário,
              cálculo, prós/contras e link para a{' '}
              <Link href="/" className="text-money font-semibold hover:underline">calculadora completa</Link>.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-20 border-b border-rule">
          <div className="max-w-6xl mx-auto px-6 md:px-8">
            <h2 className="font-display text-3xl text-ink mb-4">Tabela por faixa salarial CLT</h2>
            <p className="text-ink-muted mb-8 max-w-2xl">
              PJ equivalente = proposta típica de 1,5× o salário CLT (160h/mês). Clique para ver a análise completa.
            </p>
            <div className="post-content overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th>Salário CLT</th>
                    <th>PJ equivalente (simulado)</th>
                    <th>Análise</th>
                  </tr>
                </thead>
                <tbody>
                  {salaryBands.map((item) => (
                    <tr key={item.slug}>
                      <td>R$ {formatBRLShort(item.cltGross)}</td>
                      <td>R$ {formatBRLShort(item.pjMonthlyGross)}</td>
                      <td>
                        <Link href={`/blog/comparativo/${item.slug}`} className="text-money font-semibold hover:underline">
                          Ver simulação →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 border-b border-rule bg-paper-dark/10">
          <div className="max-w-6xl mx-auto px-6 md:px-8">
            <h2 className="font-display text-3xl text-ink mb-8">Estudos de caso (proposta fixa)</h2>
            <div className="post-content overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th>CLT</th>
                    <th>PJ proposta</th>
                    <th>Análise</th>
                  </tr>
                </thead>
                <tbody>
                  {caseStudies.map((item) => (
                    <tr key={item.slug}>
                      <td>R$ {formatBRLShort(item.cltGross)}</td>
                      <td>R$ {formatBRLShort(item.pjMonthlyGross)}</td>
                      <td>
                        <Link href={`/blog/comparativo/${item.slug}`} className="text-money font-semibold hover:underline">
                          Ver estudo →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-6 md:px-8">
            <h2 className="font-display text-3xl text-ink mb-8">Por profissão (TI e produto)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {professions.map((item) => (
                <Link
                  key={item.slug}
                  href={`/blog/comparativo/${item.slug}`}
                  className="group block p-6 border border-rule rounded-lg bg-surface hover:border-money hover:-translate-y-0.5 transition-all"
                >
                  <span className="font-mono text-[10px] uppercase tracking-widest text-money">{item.seriesLabel}</span>
                  <p className="font-display text-xl text-ink group-hover:text-money mt-2">{item.title}</p>
                  <p className="text-sm text-ink-muted mt-2 line-clamp-2">{item.description}</p>
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
  const professions = comparativos.filter((item) => item.type === 'profession');

  return {
    props: {
      salaryBands,
      caseStudies,
      professions,
    },
  };
}
