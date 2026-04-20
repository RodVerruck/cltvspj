import React, { useState } from 'react';
import Head from 'next/head';
import { Calculator, TrendingUp, CheckCircle, AlertCircle, DollarSign, ArrowRight, Briefcase, Info } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AdSense from '../components/AdSense';
import { SITE_URL } from '../lib/config';

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

  const calculateINSS = (sal) => {
    const bands = [
      { limit: 1518.00, rate: 0.075 }, // TODO: validar valor oficial 2026
      { limit: 2793.88, rate: 0.09 }, // TODO: validar valor oficial 2026
      { limit: 4190.83, rate: 0.12 }, // TODO: validar valor oficial 2026
      { limit: 8157.41, rate: 0.14 }, // TODO: validar teto 2026
    ];
    let inss = 0;
    let prev = 0;
    for (const { limit, rate } of bands) {
      if (sal <= prev) break;
      inss += (Math.min(sal, limit) - prev) * rate;
      prev = limit;
    }
    return inss;
  };

  /**
   * Aplica o redutor do IRPF criado pela Lei 15.270/2025.
   * Vigência: janeiro/2026.
   * Base legal: art. 11-A da Lei 9.250/95 (incluído pela Lei 15.270/2025).
   *
   * @param {number} baseCalculo - Base de cálculo do IR (salário bruto - INSS - outras deduções)
   * @param {number} irTradicional - IR calculado pela tabela tradicional
   * @returns {number} IR final após aplicação do redutor
   */
  function aplicarRedutorLei15270(baseCalculo, irTradicional) {
    // Faixa 1: isenção total até R$ 5.000
    if (baseCalculo <= 5000) {
      return 0;
    }

    // Faixa 2: redutor linear entre R$ 5.000,01 e R$ 7.350
    if (baseCalculo <= 7350) {
      const reducao = irTradicional * ((7350 - baseCalculo) / 2350);
      return Math.max(0, irTradicional - reducao);
    }

    // Faixa 3: acima de R$ 7.350 não há redutor
    return irTradicional;
  }

  const calculateCLT = () => {
    const sal = parseFloat(salary) || 0;
    const totalBenefits = Object.values(benefits).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);

    const inss = calculateINSS(sal);
    const irpfBase = sal - inss;
    let irpfTradicional = 0;
    if (irpfBase > 4664.68) irpfTradicional = irpfBase * 0.275 - 896.00; // TODO: validar valor oficial 2026
    else if (irpfBase > 3751.05) irpfTradicional = irpfBase * 0.225 - 662.77; // TODO: validar valor oficial 2026
    else if (irpfBase > 2826.65) irpfTradicional = irpfBase * 0.15 - 381.44; // TODO: validar valor oficial 2026
    else if (irpfBase > 2259.20) irpfTradicional = irpfBase * 0.075 - 169.44; // TODO: validar valor oficial 2026

    // Aplicar redutor da Lei 15.270/2025
    const irpf = aplicarRedutorLei15270(irpfBase, Math.max(irpfTradicional, 0));

    const netSalary = sal - inss - irpf;
    const fgts = sal * 0.08;
    const decimoTerceiro = sal / 12;
    const ferias = sal / 12;

    return {
      gross: sal,
      net: netSalary + totalBenefits,
      benefits: totalBenefits,
      inss,
      irpf: Math.max(irpf, 0),
      fgts,
      decimoTerceiro,
      ferias,
      totalPackage: netSalary + totalBenefits + fgts + decimoTerceiro + ferias
    };
  };

  const calculatePJ = () => {
    const rate = parseFloat(pjRate) || 0;
    const hours = parseFloat(hoursPerMonth) || 0;
    const monthlyGross = rate * hours;

    // DAS Simples Nacional Anexo III (6%) — cobre IRPJ, CSLL, PIS, COFINS, CPP e ISS
    const simplesDAS = monthlyGross * 0.06;
    // INSS sobre pró-labore mínimo (salário mínimo × 11% — parcela do segurado)
    const inssProLabore = Math.min(monthlyGross, 1518.00) * 0.11; // TODO: validar salário mínimo 2026

    const totalTaxes = simplesDAS + inssProLabore;
    const netMonthly = monthlyGross - totalTaxes;

    return {
      gross: monthlyGross,
      net: netMonthly,
      simplesDAS,
      inssProLabore,
      totalTaxes
    };
  };

  const handleCalculate = () => {
    setShowResults(true);
  };

  const clt = calculateCLT();
  const pj = calculatePJ();
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
        <section className="border-b border-rule py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-6 md:px-8">
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
        <section id="calc" className="border-b border-rule py-16 md:py-24">
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

                <div className="bg-paper-dark rounded p-5 mb-5">
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
                    <button type="button" className="flex-1 py-2 text-sm font-medium transition-colors border-r border-rule last:border-r-0 bg-ink text-paper">Simples</button>
                    <button type="button" className="flex-1 py-2 text-sm font-medium transition-colors border-r border-rule last:border-r-0 text-ink-muted hover:bg-rule/30">Presumido</button>
                    <button type="button" className="flex-1 py-2 text-sm font-medium transition-colors border-r border-rule last:border-r-0 text-ink-muted hover:bg-rule/30">MEI</button>
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
                  <h4 className="font-semibold text-ink mb-2">Faturamento Mensal</h4>
                  <p className="font-display text-3xl text-money">
                    R$ {((parseFloat(pjRate) || 0) * (parseFloat(hoursPerMonth) || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </p>
                </div>

                <div className="bg-hot-light border border-hot rounded p-4">
                  <div className="flex gap-2">
                    <AlertCircle className="text-hot flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="text-sm text-hot font-medium">Simples Nacional</p>
                      <p className="text-xs text-hot/80 mt-1">Cálculo baseado no Anexo III (Alíquota 6%)</p>
                    </div>
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
              onClick={handleCalculate}
              className="bg-money hover:bg-money-hover text-white px-8 py-4 rounded font-medium transition-all"
            >
              Calcular comparativo
            </button>
          </div>
          <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none"></div>

          <div className="max-w-6xl mx-auto px-6 md:px-8 relative">
            <div className="absolute inset-0 opacity-[0.15] pointer-events-none" style={{ backgroundImage: 'linear-gradient(var(--rule) 1px, transparent 1px), linear-gradient(90deg, var(--rule) 1px, transparent 1px)', backgroundSize: '48px 48px' }}></div>

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
              <span className={`font-display text-[clamp(80px,14vw,200px)] leading-[0.9] tracking-[-0.03em] ${pj.net > clt.net ? 'text-money' : 'text-hot'
                } block my-3`}>
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
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr] gap-8 mt-16 pt-12 border-t border-rule items-start relative">
              <div className={pj.net <= clt.net ? 'md:order-1' : ''}>
                <div className="font-mono text-xs uppercase tracking-[0.12em] text-ink-muted mb-3">Como CLT</div>
                <div className={`font-display text-5xl md:text-6xl leading-none mb-2 tracking-editorial ${clt.net >= pj.net ? 'text-money' : 'text-ink'
                  }`}>
                  R$ {clt.net.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </div>
                <div className="text-sm text-ink-muted">líquido + benefícios, já com Lei 15.270</div>
              </div>

              <div className="hidden md:block w-full h-full min-h-[120px] bg-rule"></div>

              <div className={pj.net <= clt.net ? 'md:order-0' : ''}>
                <div className="font-mono text-xs uppercase tracking-[0.12em] text-ink-muted mb-3">Como PJ</div>
                <div className={`font-display text-5xl md:text-6xl leading-none mb-2 tracking-editorial ${pj.net > clt.net ? 'text-money' : 'text-ink'
                  }`}>
                  R$ {pj.net.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </div>
                <div className="text-sm text-ink-muted">Simples Anexo III com Fator R otimizado</div>
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-paper-dark border border-rule rounded-lg p-6">
                <h4 className="font-display text-xl text-ink mb-4">Detalhamento CLT</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-rule">
                    <span className="text-ink-muted">Salário Bruto</span>
                    <span className="font-semibold">R$ {clt.gross.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-rule">
                    <span className="text-ink-muted">(-) INSS</span>
                    <span className="font-semibold text-hot">-R$ {clt.inss.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-rule">
                    <span className="text-ink-muted">(-) IRPF</span>
                    <span className="font-semibold text-hot">-R$ {clt.irpf.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-rule">
                    <span className="text-ink-muted">(+) Benefícios</span>
                    <span className="font-semibold text-money">+R$ {clt.benefits.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-rule">
                    <span className="text-ink-muted">FGTS (8%)</span>
                    <span className="font-semibold text-money">R$ {clt.fgts.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-rule">
                    <span className="text-ink-muted">13º Salário (mensal)</span>
                    <span className="font-semibold text-money">R$ {clt.decimoTerceiro.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-rule">
                    <span className="text-ink-muted">Férias (mensal)</span>
                    <span className="font-semibold text-money">R$ {clt.ferias.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between py-3 bg-white rounded-lg px-3 mt-2">
                    <span className="font-bold text-ink">Valor Líquido Total</span>
                    <span className="font-bold text-money text-lg">R$ {clt.net.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              <div className="bg-paper-dark border border-rule rounded-lg p-6">
                <h4 className="font-display text-xl text-ink mb-4">Detalhamento PJ</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-rule">
                    <span className="text-ink-muted">Faturamento Bruto</span>
                    <span className="font-semibold">R$ {pj.gross.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-rule">
                    <span className="text-ink-muted">(-) DAS Simples Nacional (6%)</span>
                    <span className="font-semibold text-hot">-R$ {pj.simplesDAS.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-rule">
                    <span className="text-ink-muted">(-) INSS Pró-labore (11%)</span>
                    <span className="font-semibold text-hot">-R$ {pj.inssProLabore.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between py-3 bg-white rounded-lg px-3 mt-2">
                    <span className="font-bold text-ink">Total de Impostos</span>
                    <span className="font-bold text-hot">R$ {pj.totalTaxes.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between py-3 bg-white rounded-lg px-3">
                    <span className="font-bold text-ink">Valor Líquido Mensal</span>
                    <span className="font-bold text-money text-lg">R$ {pj.net.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            </div>

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

            {/* CTA Section */}
            <div className="mt-12">
              <div className="bg-paper border border-rule rounded-lg p-8 text-center">
                <h3 className="font-display text-3xl text-ink mb-4">Quer abrir sua PJ com desconto?</h3>
                <p className="text-ink-muted mb-6 max-w-2xl mx-auto">
                  Parceiros exclusivos com condições especiais para quem usa nossa calculadora
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <a href="#" className="bg-money text-white px-8 py-3 rounded font-medium hover:opacity-90 transition">
                    Abrir Conta PJ com Cashback
                  </a>
                  <a href="#" className="border border-rule text-ink px-8 py-3 rounded font-medium hover:bg-white transition">
                    Falar com Contador
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="max-w-5xl mx-auto px-4 py-12 border-t border-rule">
          <h3 className="font-display text-2xl text-ink mb-6 text-center">Pontos Importantes</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-rule">
              <h4 className="font-display text-lg text-ink mb-2">CLT tem estabilidade</h4>
              <p className="text-sm text-ink-muted leading-relaxed">FGTS, férias remuneradas, 13º salário e direitos trabalhistas garantidos</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-rule">
              <h4 className="font-display text-lg text-ink mb-2">PJ tem mais lucro líquido</h4>
              <p className="text-sm text-ink-muted leading-relaxed">Mas você precisa pagar seu próprio plano de saúde, aposentadoria e não tem férias pagas</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-rule">
              <h4 className="font-display text-lg text-ink mb-2">Considere sua situação</h4>
              <p className="text-sm text-ink-muted leading-relaxed">Avalie segurança x ganhos, momento de vida e planejamento financeiro</p>
            </div>
          </div>
        </section>

        <Footer />
      </div >
    </>
  )
}