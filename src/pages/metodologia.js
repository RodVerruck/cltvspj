import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { SITE_URL } from '../lib/config';
import { ArrowRight, BookOpen, ShieldCheck, Scale, Calculator, HelpCircle } from 'lucide-react';

export default function Metodologia() {
  const pageUrl = `${SITE_URL}/metodologia`;
  const pageTitle = "Metodologia de Cálculo CLT vs PJ | Transparência e Regras Tributárias 2026";
  const pageDescription = "Conheça em detalhes a metodologia matemática e as fórmulas tributárias da Calculadora CLT vs PJ: INSS, IRPF, Simples Nacional (Fator R), Lucro Presumido e Ponto de Equilíbrio.";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={`${SITE_URL}/og-image.png`} />
      </Head>

      <div className="page-root">
        <Header />

        <main id="main-content" tabIndex={-1} className="focus:outline-none">
          {/* Hero da Página */}
          <section className="border-b border-rule py-16 md:py-20 relative">
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-grid-pattern" />
            <div className="max-w-4xl mx-auto px-6 md:px-8 relative">
              <div className="eyebrow mb-6">
                <span className="eyebrow-dot" />
                <span>Transparência Fiscal · Atualizado em 2026</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-ink font-bold leading-tight mb-6">
                Metodologia de Cálculo <em className="italic text-money">CLT vs PJ</em>
              </h1>

              <p className="text-lg md:text-xl text-ink-muted leading-relaxed font-sans max-w-2xl">
                Nossos cálculos são construídos sobre a legislação fiscal brasileira real, sem atalhos e sem promessas fantasiosas. Veja linha por linha como chegamos aos números.
              </p>
            </div>
          </section>

          {/* Conteúdo da Metodologia */}
          <article className="py-16 md:py-20">
            <div className="max-w-4xl mx-auto px-6 md:px-8 font-sans space-y-16">
              
              {/* Seção 1: Pacote Total CLT */}
              <section className="border-b border-rule pb-12">
                <div className="flex items-center gap-3 mb-4">
                  <Scale className="text-money w-6 h-6 flex-shrink-0" />
                  <h2 className="font-display text-2xl sm:text-3xl text-ink font-bold">1. Como calculamos o Pacote Total CLT</h2>
                </div>
                
                <p className="text-ink-muted leading-relaxed mb-6">
                  O erro mais comum ao comparar CLT e PJ é olhar apenas para o salário líquido mensal na carteira. Um trabalhador CLT formal recebe uma cesta composta de salário direto, benefícios contratuais e provisões anuais e indenizatórias.
                </p>

                <div className="bg-white border border-rule rounded-xl p-6 shadow-sm space-y-4 mb-6">
                  <h3 className="font-bold text-ink text-base">Fórmula do Pacote Total CLT Mensal:</h3>
                  <div className="font-mono text-sm bg-paper p-4 rounded border border-rule text-money font-semibold overflow-x-auto">
                    Pacote Total = Salário Líquido + Benefícios Isentos (VR + VT + Plano + Seguro) + (13º Líquido ÷ 12) + (Férias + 1/3 Líquidos ÷ 12) + FGTS Mensal (8%)
                  </div>
                  <ul className="text-sm text-ink-muted space-y-2 list-disc pl-5">
                    <li><strong>INSS CLT:</strong> Aplicado conforme a tabela progressiva oficial vigente (faixas de 7,5%, 9%, 12% e 14% com dedução de parcela até o teto do INSS).</li>
                    <li><strong>IRPF CLT:</strong> Calculado sobre o salário bruto deduzido de INSS, dependentes legais (R$ 189,59/mês cada) e pensão alimentícia judicial, aplicando as alíquotas da tabela progressiva e o redutor vigente da Lei 15.270/2025.</li>
                    <li><strong>13º e Férias:</strong> Provisões calculadas com tributação exclusiva própria e divididas por 12 para espelhar o valor econômico mensal real acumulado.</li>
                    <li><strong>FGTS:</strong> 8% recolhido mensalmente pela empresa em conta vinculada na Caixa Econômica Federal.</li>
                  </ul>
                </div>
              </section>

              {/* Seção 2: Simples Nacional e Fator R */}
              <section className="border-b border-rule pb-12">
                <div className="flex items-center gap-3 mb-4">
                  <Calculator className="text-money w-6 h-6 flex-shrink-0" />
                  <h2 className="font-display text-2xl sm:text-3xl text-ink font-bold">2. Simples Nacional e a Regra do Fator R</h2>
                </div>

                <p className="text-ink-muted leading-relaxed mb-6">
                  Para profissionais de tecnologia, engenharia, design, consultoria e saúde, a legislação do Simples Nacional submete a atividade à regra do <strong>Fator R</strong> (art. 18, § 5º-J da Lei Complementar 123/2006).
                </p>

                <div className="bg-white border border-rule rounded-xl p-6 shadow-sm space-y-4 mb-6">
                  <h3 className="font-bold text-ink text-base">Fórmula do Fator R:</h3>
                  <div className="font-mono text-sm bg-paper p-4 rounded border border-rule text-money font-semibold">
                    Fator R = Folha de Pagamento dos últimos 12 meses (RPA + Pró-labore + Encargos) ÷ Faturamento Bruto dos últimos 12 meses (RBT12)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="border border-green-200 bg-green-50/50 p-4 rounded-lg">
                      <span className="font-bold text-green-900 block mb-1">Fator R ≥ 28%: Anexo III</span>
                      <p className="text-xs text-green-800 leading-relaxed">
                        Tributação favorecida que se inicia em <strong>6,00%</strong> sobre o faturamento mensal na primeira faixa.
                      </p>
                    </div>
                    <div className="border border-amber-200 bg-amber-50/50 p-4 rounded-lg">
                      <span className="font-bold text-amber-900 block mb-1">Fator R &lt; 28%: Anexo V</span>
                      <p className="text-xs text-amber-800 leading-relaxed">
                        Tributação onerosa que se inicia em <strong>15,50%</strong> sobre o faturamento mensal na primeira faixa.
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-ink-muted pt-2 leading-relaxed">
                    Nossa calculadora simula automaticamente o pró-labore legal (mínimo de 1 salário mínimo nacional vigente de R$ 1.621) e avalia o impacto real entre aumentar a folha de pró-labore para atingir 28% ou permanecer no Anexo V.
                  </p>
                </div>
              </section>

              {/* Seção 3: Lucro Presumido */}
              <section className="border-b border-rule pb-12">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="text-money w-6 h-6 flex-shrink-0" />
                  <h2 className="font-display text-2xl sm:text-3xl text-ink font-bold">3. Lucro Presumido</h2>
                </div>

                <p className="text-ink-muted leading-relaxed mb-6">
                  Para faturamentos maiores ou empresas cuja folha não atinge o Fator R de 28%, o Lucro Presumido pode ser vantajoso. A tributação de serviços segue a base de presunção de 32%:
                </p>

                <div className="bg-white border border-rule rounded-xl p-6 shadow-sm overflow-x-auto mb-6">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-rule text-left text-ink font-mono text-xs uppercase">
                        <th className="py-2.5 px-3">Tributo</th>
                        <th className="py-2.5 px-3">Alíquota Efetiva</th>
                        <th className="py-2.5 px-3">Base de Cálculo</th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-muted divide-y divide-rule/40">
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-ink">IRPJ</td>
                        <td className="py-2.5 px-3">4,80% (+10% adicional &gt; R$ 20k/mês de lucro)</td>
                        <td className="py-2.5 px-3">Presunção de 32% sobre o faturamento</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-ink">CSLL</td>
                        <td className="py-2.5 px-3">2,88%</td>
                        <td className="py-2.5 px-3">Presunção de 32% sobre o faturamento</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-ink">PIS + COFINS</td>
                        <td className="py-2.5 px-3">3,65% (0,65% + 3,00%)</td>
                        <td className="py-2.5 px-3">Faturamento bruto cumulativo</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-ink">ISS Municipal</td>
                        <td className="py-2.5 px-3">2,00% a 5,00%</td>
                        <td className="py-2.5 px-3">Faturamento bruto (varia por cidade)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Seção 4: Ponto de Equilíbrio */}
              <section className="border-b border-rule pb-12">
                <div className="flex items-center gap-3 mb-4">
                  <ShieldCheck className="text-money w-6 h-6 flex-shrink-0" />
                  <h2 className="font-display text-2xl sm:text-3xl text-ink font-bold">4. Algoritmo de Ponto de Equilíbrio (Break-Even)</h2>
                </div>

                <p className="text-ink-muted leading-relaxed mb-4">
                  Em vez de aplicar uma regra de polegar arbitrária (como "multiplique por 1,5x"), nossa engine matemática utiliza um <strong>algoritmo numérico de busca por bisseção</strong> em 25 iterações com tolerância de centavos.
                </p>
                <p className="text-ink-muted leading-relaxed mb-6">
                  O algoritmo busca o menor faturamento mensal PJ bruto onde o <code className="bg-paper px-2 py-0.5 rounded text-money">pj.net</code> (após DAS, INSS de pró-labore, IRPF de pró-labore e mensalidade do contador) seja rigorosamente igual ou superior ao <code className="bg-paper px-2 py-0.5 rounded text-money">clt.totalPackage</code>.
                </p>
              </section>

              {/* Seção 5: Limitações e Isenção de Responsabilidade */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <HelpCircle className="text-ink-muted w-6 h-6 flex-shrink-0" />
                  <h2 className="font-display text-2xl sm:text-3xl text-ink font-bold">5. Limitações da Simulação</h2>
                </div>

                <p className="text-ink-muted leading-relaxed mb-4">
                  Esta plataforma é um recurso independente de apoio à decisão financeira. Ela não substitui uma consulta contábil formal individualizada nem emite pareceres tributários jurídicos.
                </p>

                <div className="bg-paper border border-rule rounded-xl p-6 mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div>
                    <h3 className="font-bold text-ink text-base mb-1">Quer validar seus números com contadores especializados?</h3>
                    <p className="text-xs text-ink-muted">Consulte a equipe da Manassés Contabilidade via WhatsApp sem compromisso.</p>
                  </div>
                  <a
                    href="/go/manasses"
                    rel="sponsored nofollow"
                    className="inline-flex items-center gap-2 bg-money hover:bg-money-hover text-white px-6 py-3 rounded-lg text-sm font-bold transition-all whitespace-nowrap shadow-sm hover:scale-[1.02]"
                  >
                    Falar com Especialista
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </section>

            </div>
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
}

