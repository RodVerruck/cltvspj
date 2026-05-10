import React, { useState } from 'react';
import Head from 'next/head';
import { Calculator, TrendingUp, CheckCircle, AlertCircle, DollarSign, ArrowRight, Briefcase, Info } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AdSense from '../components/AdSense';
import { SITE_URL } from '../lib/config';
import { calculateCLT, calculatePJ } from '../lib/calculator';

export default function Home() {
  const [salary, setSalary] = useState('8000');
  const [benefits, setBenefits] = useState({
    vr: '600',
    vt: '300',
    planoSaude: '400',
    seguroVida: '50'
  });
  const [pjRate, setPjRate] = useState('100');
  const [hoursPerMonth, setHoursPerMonth] = useState('160');
  const [showResults, setShowResults] = useState(false);
  const [regime, setRegime] = useState('simples');
  const [showingResults, setShowingResults] = useState(false);

  const handleCalculate = () => {
    setShowResults(true);
  };

  const clt = calculateCLT(salary, benefits);
  const pj = calculatePJ(pjRate, hoursPerMonth);
  const difference = pj.net - clt.net;
  const percentDiff = clt.net > 0 ? ((difference / clt.net) * 100).toFixed(1) : 0;

  return (
    <>
      <Head>
        <title>Calculadora CLT x PJ 2026 | Veja Qual Compensa Mais</title>
        <meta name="description" content="Calculadora gratuita CLT x PJ. Compare quanto você ganha líquido como CLT vs PJ com todos os impostos. Resultado instantâneo!" />
        <meta name="keywords" content="CLT ou PJ, calculadora CLT PJ, quanto ganho como PJ, PJ vale a pena, converter CLT para PJ, simples nacional, impostos PJ, salário líquido CLT" />
        <meta name="author" content="CLT ou PJ" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:title" content="Calculadora CLT x PJ 2026 | Veja Qual Compensa Mais" />
        <meta property="og:description" content="Compare seu salário CLT com PJ em segundos. Cálculo completo com TODOS os impostos e benefícios." />
        <meta property="og:site_name" content="CLT ou PJ" />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Calculadora CLT x PJ 2026" />
        <meta name="twitter:description" content="Descubra quanto você realmente ganha como CLT vs PJ" />
        <meta name="twitter:image" content={`${SITE_URL}/og-image.png`} />

        {/* Canonical */}
        <link rel="canonical" href={SITE_URL} />
      </Head>

      <div className="page-root">
        <Header />

        {/* Hero Section */}
        <section className="border-b border-rule py-16 md:py-24 relative">
          <div className="absolute inset-0 opacity-[0.10] pointer-events-none z-0" style={{ backgroundImage: 'linear-gradient(var(--rule) 1px, transparent 1px), linear-gradient(90deg, var(--rule) 1px, transparent 1px)', backgroundSize: '48px 48px' }}></div>
          <div className="max-w-6xl mx-auto px-6 md:px-8 relative z-10">
            <div className="eyebrow mb-7">
              <span className="eyebrow-dot"></span>
              <span>Atualizado · Lei 15.270/2025 vigente em 2026</span>
            </div>

            <h1 className="font-display text-[clamp(60px,8vw,110px)] leading-[0.9] tracking-[-0.04em] text-ink mb-8 max-w-4xl" style={{ WebkitTextStroke: '0.5px currentColor' }}>
              CLT <em className="italic text-money">ou</em> PJ.<br />
              Descubra em 60 segundos.
            </h1>

            <p className="text-lg md:text-xl text-ink-muted leading-relaxed max-w-2xl mb-12">
              A calculadora definitiva para comparar regimes - já com a nova isenção de IR até R$ 5.000, redutor progressivo e retenção de dividendos. Sem cadastro, sem enrolação.
            </p>

            <div className="flex flex-wrap gap-x-12 gap-y-6 pt-8 border-t border-rule">
              <div>
                <div className="font-display text-4xl text-ink">2026</div>
                <div className="font-mono text-xs uppercase tracking-widest text-ink-muted">Tabela atualizada</div>
              </div>
              <div>
                <div className="font-display text-4xl text-ink">R$ 5k</div>
                <div className="font-mono text-xs uppercase tracking-widest text-ink-muted">Isenção total IR</div>
              </div>
              <div>
                <div className="font-display text-4xl text-ink">3 min</div>
                <div className="font-mono text-xs uppercase tracking-widest text-ink-muted">Para concluir</div>
              </div>
              <div>
                <div className="font-display text-4xl text-ink">0</div>
                <div className="font-mono text-xs uppercase tracking-widest text-ink-muted">Cadastros pedidos</div>
              </div>
            </div>
          </div>
        </section>

        {/* Calculator Section */}
        <section id="calc" className="border-b border-rule py-16 md:py-24 bg-paper">
          <div className="max-w-6xl mx-auto px-6 md:px-8">
            <div className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-6 mb-10 pb-5 border-b border-rule">
              <span className="font-mono text-sm text-ink-muted tracking-wide">§ 01</span>
              <h2 className="font-display text-3xl md:text-4xl text-ink tracking-tight">Insira seus números</h2>
              <p className="text-sm text-ink-muted md:max-w-xs md:text-right ml-auto">Todos os cálculos consideram a tabela 2026 e as mudanças da Lei 15.270/2025.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* BLOCO CLT */}
              <div className="bg-white border border-rule rounded-md p-8 relative">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-money -translate-x-px -translate-y-px"></div>

                <div className="flex items-center gap-2 font-display text-2xl mb-6 text-ink">
                  Proposta CLT <span className="font-mono text-[11px] text-ink-muted tracking-widest uppercase ml-auto">Regime Atual</span>
                </div>

                <div className="mb-6">
                  <label className="text-sm text-ink-muted mb-2 block">Salário bruto mensal</label>
                  <div className="flex items-baseline gap-2 border-b-2 border-rule pb-2 transition-colors focus-within:border-money">
                    <span className="font-mono text-lg text-ink-fade">R$</span>
                    <input
                      type="text"
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      className="font-mono text-lg text-ink bg-transparent outline-none flex-1 py-1"
                    />
                    <span className="text-xs text-ink-fade">/mês</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-display text-lg text-ink mb-4">Benefícios Mensais</h4>
                  <div className="space-y-4">
                    {[
                      { key: 'vr', label: 'Vale Refeição' },
                      { key: 'vt', label: 'Vale Transporte' },
                      { key: 'planoSaude', label: 'Plano de Saúde' },
                      { key: 'seguroVida', label: 'Seguro de Vida' }
                    ].map(({ key, label }) => (
                      <div key={key}>
                        <label className="text-xs text-ink-muted mb-1 block">{label}</label>
                        <div className="flex items-baseline gap-2 border-b-2 border-rule pb-2 transition-colors focus-within:border-money">
                          <span className="font-mono text-ink-fade">R$</span>
                          <input
                            type="text"
                            value={benefits[key]}
                            onChange={(e) => setBenefits({ ...benefits, [key]: e.target.value })}
                            className="font-mono text-lg text-ink bg-transparent outline-none flex-1 py-1"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* BLOCO PJ */}
              <div className="bg-white border border-rule rounded-md p-8 relative">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-money -translate-x-px -translate-y-px"></div>

                <div className="flex items-center gap-2 font-display text-2xl mb-6 text-ink">
                  Proposta PJ <span className="font-mono text-[11px] text-ink-muted tracking-widest uppercase ml-auto">Alternativa</span>
                </div>

                <div className="mb-6">
                  <label className="text-sm text-ink-muted mb-2 block">Regime tributário</label>
                  <div className="flex border border-rule rounded overflow-hidden">
                    <button type="button" onClick={() => setRegime('simples')} className={`flex-1 py-2 text-sm font-medium transition-colors border-r border-rule last:border-r-0 ${regime === 'simples' ? 'bg-ink text-paper' : 'text-ink-muted hover:bg-rule/30'}`}>Simples</button>
                    <button type="button" onClick={() => setRegime('presumido')} className={`flex-1 py-2 text-sm font-medium transition-colors border-r border-rule last:border-r-0 ${regime === 'presumido' ? 'bg-ink text-paper' : 'text-ink-muted hover:bg-rule/30'}`}>Presumido</button>
                    <button type="button" onClick={() => setRegime('mei')} className={`flex-1 py-2 text-sm font-medium transition-colors border-r border-rule last:border-r-0 ${regime === 'mei' ? 'bg-ink text-paper' : 'text-ink-muted hover:bg-rule/30'}`}>MEI</button>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="text-sm text-ink-muted mb-2 block">Valor da hora (PJ)</label>
                  <div className="flex items-baseline gap-2 border-b-2 border-rule pb-2 transition-colors focus-within:border-money">
                    <span className="font-mono text-lg text-ink-fade">R$</span>
                    <input
                      type="text"
                      value={pjRate}
                      onChange={(e) => setPjRate(e.target.value)}
                      className="font-mono text-lg text-ink bg-transparent outline-none flex-1 py-1"
                    />
                    <span className="text-xs text-ink-fade">/hora</span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="text-sm text-ink-muted mb-2 block">Horas trabalhadas/mês</label>
                  <div className="flex items-baseline gap-2 border-b-2 border-rule pb-2 transition-colors focus-within:border-money">
                    <input
                      type="text"
                      value={hoursPerMonth}
                      onChange={(e) => setHoursPerMonth(e.target.value)}
                      className="font-mono text-lg text-ink bg-transparent outline-none flex-1 py-1"
                    />
                    <span className="text-xs text-ink-fade">horas</span>
                  </div>
                </div>

                <div className="bg-money-light rounded p-5 mb-5">
                  <h4 className="font-display text-lg text-ink mb-2">Faturamento Mensal</h4>
                  <p className="font-display text-3xl text-money">
                    R$ {((parseFloat(pjRate) || 0) * (parseFloat(hoursPerMonth) || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </p>
                </div>

                <div className="bg-hot-light border border-hot rounded p-4">
                  <div className="flex gap-2">
                    <AlertCircle className="text-hot flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="text-sm text-hot font-medium">
                        {regime === 'simples' ? 'Simples Nacional' : regime === 'presumido' ? 'Lucro Presumido' : 'MEI'}
                      </p>
                      <p className="text-xs text-hot/80 mt-1">
                        {regime === 'simples' ? 'Cálculo baseado no Anexo III (Alíquota 6%)' : regime === 'presumido' ? 'Alíquotas: 1.6% a 32% selon atividade' : 'Teto mensal: R$ 8.500'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-rule flex flex-col md:flex-row items-center justify-between gap-6">
                <p className="font-display italic text-xl text-ink-muted">
                  "Não é sobre qual paga mais, é sobre qual faz sentido pra tua vida."
                </p>
                <button
                  onClick={() => { setShowResults(true); setShowingResults(true); setTimeout(() => document.getElementById('resultado')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
                  className="bg-money hover:bg-money-hover text-white px-8 py-4 rounded font-medium transition-all"
                >
                  {showingResults ? 'Recalcular' : 'Calcular comparativo'}
                </button>
              </div>
            </div>
</section>

          {showingResults && (
          <section id="resultado" className="py-16 md:py-24 relative bg-paper-dark">
            <div className="max-w-6xl mx-auto px-6 md:px-8 relative z-10">
              <div className="absolute inset-0 opacity-[0.10] pointer-events-none z-0" style={{ backgroundImage: 'linear-gradient(var(--rule) 1px, transparent 1px), linear-gradient(90deg, var(--rule) 1px, transparent 1px)', backgroundSize: '48px 48px' }}></div>

              <div className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-6 mb-10 pb-5 border-b border-rule">
                <span className="font-mono text-sm text-ink-muted tracking-wide">§ 02</span>
                <h2 className="font-display text-3xl md:text-4xl text-ink tracking-tight">Resultado</h2>
                <p className="text-sm text-ink-muted md:max-w-xs md:text-right ml-auto">Considerando benefícios, impostos, férias, 13º e nova isenção de IR.</p>
              </div>

            {/* HERO NUMBER */}
            <div className="mb-12 relative">
              <span className="font-display italic text-2xl md:text-3xl text-ink-muted block mb-2">
                {pj.net > clt.net ? 'PJ paga, no seu caso,' : 'CLT paga, no seu caso,'}
              </span>
              <span className={`font-display text-money tracking-editorial block mb-3 leading-none ${pj.net > clt.net ? 'text-money' : 'text-hot'
                }`} style={{ fontSize: 'clamp(72px, 12vw, 160px)' }}>
                R$ {Math.abs(pj.net - clt.net).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>
              <span className="font-display italic text-2xl md:text-3xl text-ink-muted block">
                a mais por mês - R$ {Math.abs((pj.net - clt.net) * 12).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} por ano.
              </span>

              <div className="mt-6">
                <span className={`inline-flex items-center gap-2 font-mono text-sm px-3 py-1.5 rounded-full ${pj.net > clt.net
                  ? 'text-money bg-money-light'
                  : 'text-hot bg-hot-light'
                  }`}>
                  <span>{pj.net > clt.net ? '×' : '×'}</span>
                  <span>
                    {Math.abs(((pj.net - clt.net) / clt.net) * 100).toFixed(1)}% em relação ao {pj.net > clt.net ? 'CLT' : 'PJ'} líquido
                  </span>
                </span>
              </div>
            </div>

            {/* COMPARE */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr] gap-8 mt-16 mb-16 pt-12 border-t border-rule items-start">
              <div className="flex flex-col">
                <span className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-2">Como CLT</span>
                <span className={`font-display text-5xl text-ink leading-none mb-2 ${clt.net >= pj.net ? 'text-money' : ''}`}>R$ {clt.net.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                <span className="text-sm text-ink-muted">Líquido + benefícios, já com Lei 15.270</span>
              </div>

              <div className="hidden md:block w-full h-full min-h-[100px] bg-rule"></div>

              <div className="flex flex-col">
                <span className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-2">Como PJ</span>
                <span className={`font-display text-5xl text-ink leading-none mb-2 ${pj.net > clt.net ? 'text-money' : ''}`}>R$ {pj.net.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                <span className="text-sm text-ink-muted">Simples Anexo III com Fator R otimizado</span>
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-paper-dark/50 border border-rule rounded-lg p-8">
                <h4 className="font-display text-2xl text-ink mb-6">Detalhamento CLT</h4>
                <div className="font-mono text-sm space-y-0">
                  <div className="flex justify-between py-2 border-b border-rule">
                    <span className="text-ink-muted">Salário Bruto</span>
                    <span className="text-ink">R$ {clt.gross.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-rule">
                    <span className="text-ink-muted">(-) INSS</span>
                    <span className="text-hot">-R$ {clt.inss.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-rule">
                    <span className="text-ink-muted">(-) IRPF</span>
                    <span className="text-hot">-R$ {clt.irpf.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-rule">
                    <span className="text-ink-muted">(+) Benefícios</span>
                    <span className="text-money">+R$ {clt.benefits.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-rule">
                    <span className="text-ink-muted">FGTS (8%)</span>
                    <span className="text-money">R$ {clt.fgts.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-rule">
                    <span className="text-ink-muted">13º Salário (mensal)</span>
                    <span className="text-money">R$ {clt.decimoTerceiro.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-rule">
                    <span className="text-ink-muted">Férias (mensal)</span>
                    <span className="text-money">R$ {clt.ferias.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between pt-3 mt-1 font-semibold">
                    <span className="text-ink">Valor Líquido Total</span>
                    <span className="text-money text-base">R$ {clt.net.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              <div className="bg-paper-dark/50 border border-rule rounded-lg p-8">
                <h4 className="font-display text-2xl text-ink mb-6">Detalhamento PJ</h4>
                <div className="font-mono text-sm space-y-0">
                  <div className="flex justify-between py-2 border-b border-rule">
                    <span className="text-ink-muted">Faturamento Bruto</span>
                    <span className="text-ink">R$ {pj.gross.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-rule">
                    <span className="text-ink-muted">(-) DAS Simples Nacional (6%)</span>
                    <span className="text-hot">-R$ {pj.simplesDAS.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-rule">
                    <span className="text-ink-muted">(-) INSS Pró-labore (11%)</span>
                    <span className="text-hot">-R$ {pj.inssProLabore.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between pt-3 mt-1 font-semibold">
                    <span className="text-ink">Total de Impostos</span>
                    <span className="text-hot">R$ {pj.totalTaxes.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between pt-3 font-semibold">
                    <span className="text-ink">Valor Líquido Mensal</span>
                    <span className="text-money text-base">R$ {pj.net.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
          )}

        {/* Conditional CTA for PJ > CLT */}
        {pj.net > clt.net && (
        <section className="py-16 md:py-20 bg-money text-paper">
              <div className="max-w-6xl mx-auto px-6 md:px-8">
                  <div className="grid md:grid-cols-[1.2fr_1fr] gap-10 md:gap-16 items-center">
                    <div>
                      <div className="font-mono text-xs uppercase tracking-[0.15em] text-paper/60 mb-4">
                        Recomendação contextual
                      </div>
                      <h3 className="font-display text-4xl md:text-[44px] leading-[1.05] tracking-editorial mb-4">
                        Pra virar PJ,<br />você vai precisar<br />de contador.
                      </h3>
                      <p className="text-base leading-relaxed text-paper/80 mb-8 max-w-lg">
                        Abertura de CNPJ, DAS mensal, pró-labore, DEFIS, DIRF. A Contabilizei cuida de tudo online com plano a partir de R$ 89/mês - primeiros dois meses grátis pra quem vem daqui.
                      </p>
                      <a
                        href="/go/contabilizei"
                        rel="sponsored nofollow"
                        className="inline-flex items-center gap-2.5 bg-paper text-money hover:bg-hot hover:text-paper px-6 py-3 rounded font-medium transition-all"
                      >
                        Conhecer Contabilizei
                        <span>×</span>
                      </a>
                      <p className="text-xs text-paper/50 mt-5 italic">
                        Link de parceria. Não muda o preço pra você e ajuda a manter a calculadora gratuita.
                      </p>
                    </div>

                    <div className="flex flex-col gap-4 pl-0 md:pl-12 md:border-l border-paper/20">
                      <div className="flex justify-between items-baseline border-b border-paper/10 pb-3">
                        <span className="font-display text-lg italic text-paper">Contabilizei</span>
                        <span className="font-mono text-sm text-paper/60">a partir de R$ 89/mês</span>
                      </div>
                      <div className="flex justify-between items-baseline border-b border-paper/10 pb-3">
                        <span className="font-display text-lg italic text-paper">Agilize</span>
                        <span className="font-mono text-sm text-paper/60">a partir de R$ 99/mês</span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="font-display text-lg italic text-paper">Conube</span>
                        <span className="font-mono text-sm text-paper/60">a partir de R$ 79/mês</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

        <Footer />
      </div >
    </>
  )
}