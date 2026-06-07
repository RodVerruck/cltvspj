import React, { useState } from 'react';
import Head from 'next/head';
import { Calculator, TrendingUp, CheckCircle, AlertCircle, DollarSign, ArrowRight, Briefcase, Info, Users } from 'lucide-react';
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
  const [faturamento12Meses, setFaturamento12Meses] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [regime, setRegime] = useState('simples');
  const [showingResults, setShowingResults] = useState(false);

  const handleCalculate = () => {
    setShowResults(true);
  };

  const clt = calculateCLT(salary, benefits);
  let pj = calculatePJ(pjRate, hoursPerMonth, regime, faturamento12Meses);
  let meiExcedido = false;

  if (regime === 'mei' && pj.isInvalidMEI) {
    meiExcedido = true;
    pj = calculatePJ(pjRate, hoursPerMonth, 'simples', faturamento12Meses);
  }

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

            <h1 className="font-display text-[clamp(60px,8vw,110px)] leading-[0.95] tracking-editorial text-ink mb-8 max-w-4xl">
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

                {regime === 'simples' && (
                  <div className="mb-6 animate-fade-in">
                    <label className="text-sm text-ink-muted mb-2 block flex items-center gap-1.5">
                      Faturamento acumulado 12 meses
                      <span className="text-[10px] bg-rule/50 px-1.5 py-0.5 rounded text-ink-fade font-mono uppercase font-bold tracking-wider">Opcional</span>
                    </label>
                    <div className="flex items-baseline gap-2 border-b-2 border-rule pb-2 transition-colors focus-within:border-money">
                      <span className="font-mono text-lg text-ink-fade">R$</span>
                      <input
                        type="text"
                        value={faturamento12Meses}
                        onChange={(e) => setFaturamento12Meses(e.target.value)}
                        placeholder="Estimar pelo faturamento atual"
                        className="font-mono text-lg text-ink bg-transparent outline-none flex-1 py-1 placeholder:text-ink-fade/40"
                      />
                    </div>
                    <p className="text-[10px] text-ink-fade mt-1 leading-normal font-sans">
                      Informe a soma dos últimos 12 meses de faturamento retroativo. Se deixado em branco, estimamos o RBT12 com base no faturamento mensal atual.
                    </p>
                  </div>
                )}

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
                        {regime === 'simples' ? 'Cálculo baseado no Anexo III (Alíquota 6%)' : regime === 'presumido' ? 'Total consolidado ~14,5% (IRPJ+CSLL+PIS+COFINS+ISS)' : 'Teto mensal: R$ 6.750 (DAS R$ 86,05)'}
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

              {/* ALERTA TETO MEI EXCEDIDO */}
              {meiExcedido && (
                <div className="bg-hot-light border border-hot/30 rounded-xl p-6 mb-8 flex gap-4 items-start relative animate-fade-in overflow-hidden shadow-sm">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-hot"></div>
                  <AlertCircle className="text-hot flex-shrink-0 mt-0.5" size={22} />
                  <div>
                    <h4 className="font-display text-xl text-ink font-bold mb-1">Teto do MEI Excedido</h4>
                    <p className="text-sm text-ink-muted leading-relaxed font-sans">
                      O faturamento mensal simulado de <strong className="text-ink">R$ {((parseFloat(pjRate) || 0) * (parseFloat(hoursPerMonth) || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</strong> ultrapassa o limite mensal médio permitido de <strong className="text-ink">R$ 6.750,00</strong> para o MEI em 2026. 
                      Para que sua comparação seja realista e legal, recalculamos os impostos e o valor líquido abaixo automaticamente com base nas regras do <strong className="text-ink">Simples Nacional Anexo III (Fator R)</strong>.
                    </p>
                  </div>
                </div>
              )}

              {/* HERO RESULT CARD */}
              <div className={`border rounded-xl p-8 md:p-10 mb-12 relative overflow-hidden transition-colors duration-500 shadow-sm ${
                pj.net > clt.totalPackage 
                  ? 'bg-money-light border-money/20' 
                  : 'bg-hot-light border-hot/20'
              }`}>
                <div className={`absolute top-0 left-0 w-2 h-full ${pj.net > clt.totalPackage ? 'bg-money' : 'bg-hot'}`}></div>
                
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  <div>
                    <span className="font-mono text-xs uppercase tracking-widest text-ink-muted block mb-2">Recomendação</span>
                    <h3 className="font-display text-3xl md:text-4xl text-ink font-bold leading-tight mb-3">
                      {pj.net > clt.totalPackage ? (
                        <>A opção <span className="text-money italic font-bold">PJ</span> é mais vantajosa para você.</>
                      ) : (
                        <>A opção <span className="text-hot italic font-bold">CLT</span> é mais vantajosa para você.</>
                      )}
                    </h3>
                    <p className="text-base text-ink-muted max-w-xl font-sans">
                      Cálculo completo considerando salários brutos, descontos de impostos vigentes em 2026, nova faixa de isenção de IR até R$ 5.000, benefícios CLT (13º, férias, FGTS) e o regime PJ {meiExcedido ? 'Simples Nacional (teto do MEI excedido)' : regime === 'mei' ? 'MEI' : regime === 'presumido' ? 'Lucro Presumido' : 'Simples Nacional com Fator R'}.
                    </p>
                  </div>

                  <div className={`border rounded-lg p-6 min-w-[280px] lg:text-right flex flex-col justify-center bg-white/70 backdrop-blur-sm ${
                    pj.net > clt.totalPackage ? 'border-money/15' : 'border-hot/15'
                  }`}>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted block mb-1">
                      {pj.net > clt.totalPackage ? 'Rendimento Extra Mensal (PJ)' : 'Rendimento Extra Mensal (CLT)'}
                    </span>
                    <span className={`font-display text-4xl md:text-5xl font-black block leading-none mb-2 ${pj.net > clt.totalPackage ? 'text-money' : 'text-hot'}`}>
                      + R$ {Math.abs(pj.net - clt.totalPackage).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                    <span className="text-xs text-ink-muted font-sans block mb-3">
                      Equivale a <strong className="text-ink">{Math.abs(((pj.net - clt.totalPackage) / (pj.net > clt.totalPackage ? clt.totalPackage : pj.net)) * 100).toFixed(1)}%</strong> a mais de rendimento.
                    </span>
                    <span className={`font-mono text-[10px] uppercase tracking-wider text-ink-muted block border-t pt-3 ${
                      pj.net > clt.totalPackage ? 'border-money/15' : 'border-hot/15'
                    }`}>
                      Diferença anual: + R$ {Math.abs((pj.net - clt.totalPackage) * 12).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}/ano
                    </span>
                  </div>
                </div>
              </div>

            {/* COMPARE */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr] gap-8 mt-16 mb-16 pt-12 border-t border-rule items-start">
              <div className="flex flex-col">
                <span className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-2">Como CLT</span>
                <span className={`font-display text-5xl text-ink leading-none mb-2 ${clt.totalPackage >= pj.net ? 'text-money' : ''}`}>R$ {clt.totalPackage.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                <span className="text-sm text-ink-muted">Pacote total: líquido + 13º + férias + FGTS</span>
              </div>

              <div className="hidden md:block w-full h-full min-h-[100px] bg-rule"></div>

              <div className="flex flex-col">
                <span className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-2">Como PJ</span>
                <span className={`font-display text-5xl text-ink leading-none mb-2 ${pj.net > clt.totalPackage ? 'text-money' : ''}`}>R$ {pj.net.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                <span className="text-sm text-ink-muted">
                  {meiExcedido 
                    ? `Simples Anexo III (Teto MEI excedido) — ${pj.taxName}` 
                    : regime === 'mei' 
                      ? 'MEI - Microempreendedor Individual' 
                      : regime === 'presumido' 
                        ? 'Lucro Presumido (Carga ~14,5%)' 
                        : pj.taxName}
                </span>
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
                  <div className="flex justify-between pt-3 mt-1 font-semibold border-t-2 border-money/30">
                    <span className="text-ink">Total do Pacote Mensal</span>
                    <span className="text-money text-base">R$ {clt.totalPackage.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
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
                    <span className="text-ink-muted">(-) {pj.taxName || 'DAS Simples Nacional (6%)'}</span>
                    <span className="text-hot">-R$ {pj.simplesDAS.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  {pj.inssProLabore > 0 && (
                    <div className="flex justify-between py-2 border-b border-rule">
                      <span className="text-ink-muted">(-) INSS Pró-labore (11%)</span>
                      <span className="text-hot">-R$ {pj.inssProLabore.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  )}
                  {pj.irpfProLabore > 0 && (
                    <div className="flex justify-between py-2 border-b border-rule">
                      <span className="text-ink-muted">(-) IRPF Pró-labore</span>
                      <span className="text-hot">-R$ {pj.irpfProLabore.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  )}
                  {pj.inssPatronal > 0 && (
                    <div className="flex justify-between py-2 border-b border-rule">
                      <span className="text-ink-muted">(-) INSS Patronal (20%)</span>
                      <span className="text-hot">-R$ {pj.inssPatronal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  )}
                  {pj.dividendTax > 0 && (
                    <div className="flex justify-between py-2 border-b border-rule">
                      <span className="text-ink-muted">(-) IRRF Dividendos (10% &gt; 50k)</span>
                      <span className="text-hot">-R$ {pj.dividendTax.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  )}
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
        {pj.net > clt.totalPackage && (
        <section className="py-16 md:py-20 bg-money text-paper animate-fade-in">
              <div className="max-w-6xl mx-auto px-6 md:px-8">
                  <div className="grid md:grid-cols-[1.2fr_1fr] gap-10 md:gap-16 items-center">
                    <div>
                      <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/60 mb-5 font-bold">
                        Recomendação de Parceiro
                      </div>
                      <h3 className="font-display text-4xl md:text-[44px] leading-[1.05] tracking-editorial mb-5">
                        Pra virar PJ,<br />você vai precisar<br />de contador.
                      </h3>
                      <p className="text-base leading-relaxed text-paper/85 mb-8 max-w-lg font-sans">
                        Abertura de CNPJ grátis, pró-labore, Fator R e assessoria mensal. A Manassés Contabilidade é especialista em TI com planos a partir de R$ 349/mês — e você ganha 50% de desconto na primeira mensalidade!
                      </p>
                      <a
                        href="/go/manasses"
                        rel="sponsored nofollow"
                        className="group inline-flex items-center gap-2 bg-[#f5f1e8] text-[#0c4a3e] hover:bg-white px-7 py-3.5 rounded font-medium transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
                      >
                        Conhecer Manassés
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </a>
                      <p className="text-[10px] text-paper/50 mt-5 italic font-mono uppercase tracking-wider">
                        Link de parceria · Sem custo extra para você
                      </p>
                    </div>

                    <div className="flex flex-col gap-6 pl-0 md:pl-12 md:border-l border-paper/20">
                      <div className="border-b border-paper/10 pb-4">
                        <div className="font-display text-xl font-bold text-paper mb-2 flex items-center gap-2">
                          <Briefcase className="w-5 h-5 text-paper/80" />
                          <span>Especialistas em TI</span>
                        </div>
                        <p className="text-sm text-paper/90 leading-relaxed font-sans">Planejamento tributário estratégico e Fator R (redução legal de imposto no Simples Nacional).</p>
                      </div>
                      <div className="border-b border-paper/10 pb-4">
                        <div className="font-display text-xl font-bold text-paper mb-2 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-paper/80" />
                          <span>Abertura de CNPJ Grátis</span>
                        </div>
                        <p className="text-sm text-paper/90 leading-relaxed font-sans">Processo ágil de abertura de empresa sem cobrança de taxas de serviços adicionais.</p>
                      </div>
                      <div>
                        <div className="font-display text-xl font-bold text-paper mb-2 flex items-center gap-2">
                          <Users className="w-5 h-5 text-paper/80" />
                          <span>Suporte 100% Humano</span>
                        </div>
                        <p className="text-sm text-paper/90 leading-relaxed font-sans">Fale direto com contadores por WhatsApp, sem chamados em fila ou chats burocráticos.</p>
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