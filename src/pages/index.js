import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Calculator, TrendingUp, CheckCircle, AlertCircle, DollarSign, ArrowRight, Briefcase, Info, Users, Share2, Copy, Check, MessageCircle, Scale } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AdSense from '../components/AdSense';
import { SITE_URL } from '../lib/config';
import { calculateCLT, calculatePJ, calculatePJBreakEven } from '../lib/calculator';
import { getCalculatorSchemaJsonLd } from '../lib/schema/calculator';

const calculatorSchemaJsonLd = getCalculatorSchemaJsonLd();

export default function Home() {
  const router = useRouter();
  const [copiedLink, setCopiedLink] = useState(false);
  const [salary, setSalary] = useState('8000');
  const [benefits, setBenefits] = useState({
    vr: '600',
    vt: '300',
    planoSaude: '400',
    seguroVida: '50'
  });
  const [pjRate, setPjRate] = useState('100');
  const [hoursPerMonth, setHoursPerMonth] = useState('160');
  const [pjInputMode, setPjInputMode] = useState('mensal');
  const [pjMonthlyInput, setPjMonthlyInput] = useState('16000');
  const [showCltAdvanced, setShowCltAdvanced] = useState(false);
  const [showPjAdvanced, setShowPjAdvanced] = useState(false);
  const [faturamento12Meses, setFaturamento12Meses] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [regime, setRegime] = useState('simples');
  const [showingResults, setShowingResults] = useState(false);
  const [showDetalhamento, setShowDetalhamento] = useState(false);

  // Novos estados para a evolução tributária
  const [dependentes, setDependentes] = useState('0');
  const [pensaoAlimenticia, setPensaoAlimenticia] = useState('');
  const [plrAnual, setPlrAnual] = useState('');
  const [proLaboreInput, setProLaboreInput] = useState('minimo');
  const [proLaboreCustom, setProLaboreCustom] = useState('');
  const [folha12Meses, setFolha12Meses] = useState('');
  const [issRate, setIssRate] = useState('3');
  const [mensalidadeContador, setMensalidadeContador] = useState('');

  const handlePjMonthlyChange = (val) => {
    setPjMonthlyInput(val);
    const numericMonthly = parseFloat(String(val).replace(',', '.')) || 0;
    const h = parseFloat(hoursPerMonth) || 160;
    setPjRate(String(numericMonthly / h));
  };

  const handlePjRateChange = (val) => {
    setPjRate(val);
    const numericRate = parseFloat(String(val).replace(',', '.')) || 0;
    const h = parseFloat(hoursPerMonth) || 160;
    setPjMonthlyInput(String(Math.round(numericRate * h)));
  };

  const handleHoursChange = (val) => {
    setHoursPerMonth(val);
    const numericHours = parseFloat(String(val).replace(',', '.')) || 0;
    const numericRate = parseFloat(String(pjRate).replace(',', '.')) || 0;
    setPjMonthlyInput(String(Math.round(numericRate * numericHours)));
  };

  const switchPjInputMode = (mode) => {
    if (mode === 'hora') {
      const cleanRate = Number((parseFloat(pjRate) || 0).toFixed(2));
      setPjRate(String(cleanRate));
    } else {
      const m = Math.round((parseFloat(pjRate) || 0) * (parseFloat(hoursPerMonth) || 160));
      setPjMonthlyInput(String(m));
    }
    setPjInputMode(mode);
  };

  // Leitura de parâmetros de compartilhamento via URL
  useEffect(() => {
    if (!router.isReady) return;
    const q = router.query;
    let hasUrlParams = false;

    if (q.salary || q.clt) {
      setSalary(String(q.salary || q.clt));
      hasUrlParams = true;
    }
    if (q.pjRate) {
      const r = Number(q.pjRate) || 0;
      const h = Number(q.hours) || 160;
      setPjRate(String(r));
      setPjMonthlyInput(String(Math.round(r * h)));
      hasUrlParams = true;
    } else if (q.pj) {
      const m = Number(q.pj) || 0;
      const h = Number(q.hours) || 160;
      setPjMonthlyInput(String(m));
      setPjRate(String(m / h));
      setPjInputMode('mensal');
      hasUrlParams = true;
    }
    if (q.hours) setHoursPerMonth(String(q.hours));
    if (q.regime && ['simples', 'presumido', 'mei'].includes(String(q.regime))) {
      setRegime(String(q.regime));
    }
    if (q.vr || q.vt || q.plano || q.seguro) {
      setBenefits(prev => ({
        vr: q.vr !== undefined ? String(q.vr) : prev.vr,
        vt: q.vt !== undefined ? String(q.vt) : prev.vt,
        planoSaude: q.plano !== undefined ? String(q.plano) : prev.planoSaude,
        seguroVida: q.seguro !== undefined ? String(q.seguro) : prev.seguroVida,
      }));
    }
    if (q.dep) setDependentes(String(q.dep));
    if (q.contador) setMensalidadeContador(String(q.contador));

    if (hasUrlParams) {
      setShowResults(true);
      setShowingResults(true);
      setTimeout(() => {
        document.getElementById('resultado')?.scrollIntoView({ behavior: 'smooth' });
      }, 350);
    }
  }, [router.isReady]);

  const handleCalculate = () => {
    setShowResults(true);
  };

  const clt = calculateCLT(salary, benefits, dependentes, pensaoAlimenticia, plrAnual);
  let pj = calculatePJ(
    pjRate, 
    hoursPerMonth, 
    regime, 
    faturamento12Meses, 
    proLaboreInput === 'personalizado' ? proLaboreCustom : proLaboreInput, 
    folha12Meses, 
    issRate,
    dependentes,
    pensaoAlimenticia,
    mensalidadeContador
  );
  let meiExcedido = false;

  if (regime === 'mei' && pj.isInvalidMEI) {
    meiExcedido = true;
    pj = calculatePJ(
      pjRate, 
      hoursPerMonth, 
      'simples', 
      faturamento12Meses, 
      proLaboreInput === 'personalizado' ? proLaboreCustom : proLaboreInput, 
      folha12Meses, 
      issRate,
      dependentes,
      pensaoAlimenticia,
      mensalidadeContador
    );
  }

  const ganhoGeral = Math.abs(pj.net - clt.totalPackage);
  let impactoGeralLabel = 'Impacto Baixo';
  let impactoGeralCor = 'bg-green-50 text-green-700 border-green-200';
  let impactoBolinha = '🟢';

  if (ganhoGeral >= 100 && ganhoGeral < 500) {
    impactoGeralLabel = 'Impacto Moderado';
    impactoGeralCor = 'bg-yellow-50 text-yellow-700 border-yellow-200';
    impactoBolinha = '🟡';
  } else if (ganhoGeral >= 500) {
    impactoGeralLabel = 'Impacto Alto';
    impactoGeralCor = 'bg-red-50 text-red-700 border-red-200';
    impactoBolinha = '🔴';
  }

  const relacao = pj.gross / (clt.gross || 1);
  const showAlertaDiscrepancia = relacao > 1.2 || relacao < 0.8;

  const isHistoricoInformado = Number(faturamento12Meses) > 0 && Number(folha12Meses) > 0;
  const isPadraoFatorR = proLaboreInput === 'padrao';

  let FatorRLabel = 'Fator R Estimado';
  let FatorRDesc = `Para fins previdenciários, a simulação considera a contribuição baseada no pró-labore selecionado de R$ ${pj.proLabore.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/mês.`;

  if (isHistoricoInformado) {
    FatorRLabel = 'Fator R Real';
    FatorRDesc = 'Calculado a partir do histórico real de 12 meses informado por você.';
  } else if (isPadraoFatorR) {
    FatorRLabel = 'Fator R Projetado';
    if (pj.gross < 5789.28) {
      FatorRDesc = 'Para fins previdenciários, a simulação considera a contribuição mínima baseada em 1 salário mínimo vigente (R$ 1.621,00).';
    } else {
      FatorRDesc = 'Cenário projetado automaticamente a partir do pró-labore padrão (28%) para obter o enquadramento no Anexo III.';
    }
  }

  const excede100 = pj.fatorRPercent > 100;
  if (excede100) {
    FatorRDesc = `Para fins previdenciários, a simulação considera a contribuição mínima baseada em 1 salário mínimo vigente (R$ 1.621,00), que supera o faturamento mensal simulado de R$ ${pj.gross.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`;
  }

  const breakEven = calculatePJBreakEven(
    clt.totalPackage,
    hoursPerMonth,
    regime,
    proLaboreInput === 'personalizado' ? proLaboreCustom : proLaboreInput,
    mensalidadeContador
  );
  const breakEvenMultiplier = clt.gross > 0 ? (breakEven.monthlyGross / clt.gross).toFixed(2) : '1.50';

  const maxComparisonVal = Math.max(clt.totalPackage || 0, pj.net || 0, 1);
  const cltBarPercent = Math.round(((clt.totalPackage || 0) / maxComparisonVal) * 100);
  const pjBarPercent = Math.round(((pj.net || 0) / maxComparisonVal) * 100);

  const getShareUrl = () => {
    if (typeof window === 'undefined') return '';
    const params = new URLSearchParams();
    params.set('salary', salary);
    params.set('pjRate', pjRate);
    params.set('hours', hoursPerMonth);
    params.set('regime', regime);
    if (benefits.vr) params.set('vr', benefits.vr);
    if (benefits.vt) params.set('vt', benefits.vt);
    if (benefits.planoSaude) params.set('plano', benefits.planoSaude);
    if (benefits.seguroVida) params.set('seguro', benefits.seguroVida);
    if (dependentes && dependentes !== '0') params.set('dep', dependentes);
    if (mensalidadeContador) params.set('contador', mensalidadeContador);
    return `${window.location.origin}/?${params.toString()}`;
  };

  const handleCopyLink = () => {
    const url = getShareUrl();
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const handleShareWhatsApp = () => {
    const url = getShareUrl();
    const dif = Math.abs(pj.net - clt.totalPackage);
    const vencedor = pj.net > clt.totalPackage ? 'PJ' : 'CLT';
    const text = `📊 Simulação CLT vs PJ (2026):
• CLT Bruto: R$ ${Number(salary || 0).toLocaleString('pt-BR')} (Pacote Total: R$ ${clt.totalPackage.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}/mês)
• PJ Faturamento: R$ ${pj.gross.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}/mês (Líquido: R$ ${pj.net.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}/mês)
👉 Resultado: ${vencedor} rende +R$ ${dif.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}/mês!

Veja o cálculo detalhado:
${url}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <>
      <Head>
        <title>Calculadora CLT vs PJ 2026: Compare Salário Líquido e Benefícios</title>
        <meta name="description" content="Simule e compare o salário líquido entre CLT e PJ em 2026 com todos os impostos (INSS, IRPF, Simples Nacional), benefícios e custos de contador." />
        <meta name="keywords" content="CLT vs PJ, calculadora CLT PJ, salário líquido CLT, impostos PJ, Simples Nacional, Fator R, converter CLT para PJ" />
        <meta name="author" content="CLT ou PJ" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:title" content="Calculadora CLT vs PJ 2026: Compare Salário Líquido e Benefícios" />
        <meta property="og:description" content="Simulação completa entre CLT e PJ em 2026 considerando impostos, encargos trabalhistas, benefícios e pró-labore." />
        <meta property="og:site_name" content="CLT ou PJ" />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Calculadora CLT vs PJ 2026: Compare Salário Líquido e Benefícios" />
        <meta name="twitter:description" content="Simule e compare o salário líquido entre CLT e PJ em 2026 com todos os impostos e benefícios." />
        <meta name="twitter:image" content={`${SITE_URL}/og-image.png`} />

        {/* Canonical */}
        <link rel="canonical" href={SITE_URL} />

        {/* Schema.org JSON-LD — calculadora como WebApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(calculatorSchemaJsonLd),
          }}
        />
      </Head>

      <div className="page-root">
        <Header />

        <main id="main-content" tabIndex={-1} className="focus:outline-none">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-sans items-stretch">
              {/* BLOCO CLT */}
              <fieldset className="bg-white border border-rule rounded-xl p-6 sm:p-8 relative shadow-sm flex flex-col justify-between h-full">
                <legend className="sr-only">Proposta CLT (Regime Atual)</legend>
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-money -translate-x-px -translate-y-px"></div>

                <div>
                  <div className="flex items-center gap-2 font-display text-2xl mb-6 text-ink" aria-hidden="true">
                    Proposta CLT <span className="font-mono text-[11px] text-ink-muted tracking-widest uppercase ml-auto">Regime Atual</span>
                  </div>

                  {/* Salário Bruto Mensal */}
                  <div className="mb-6">
                    <label htmlFor="field-salary" className="text-sm font-medium text-ink mb-2 block">Salário bruto mensal</label>
                    <div className="flex items-baseline gap-2 border-b-2 border-rule pb-2 transition-colors focus-within:border-money">
                      <span className="font-mono text-lg text-ink-fade">R$</span>
                      <input
                        id="field-salary"
                        type="text"
                        inputMode="decimal"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                        className="font-mono text-2xl sm:text-3xl font-bold text-ink bg-transparent outline-none flex-1 py-1"
                      />
                      <span className="text-xs text-ink-fade">/mês</span>
                    </div>
                  </div>

                  {/* Benefícios Mensais em Grid 2x2 Compacto */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-display text-lg text-ink font-bold">Benefícios Mensais</h4>
                      <span className="text-xs font-mono text-money font-bold bg-money-light border border-money/20 px-2.5 py-0.5 rounded shadow-sm">
                        Total: R$ {((parseFloat(benefits.vr) || 0) + (parseFloat(benefits.vt) || 0) + (parseFloat(benefits.planoSaude) || 0) + (parseFloat(benefits.seguroVida) || 0)).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {[
                        { key: 'vr', label: 'Vale Refeição / Alimentação' },
                        { key: 'planoSaude', label: 'Plano de Saúde' },
                        { key: 'vt', label: 'Vale Transporte / Auxílio' },
                        { key: 'seguroVida', label: 'Seguro de Vida / Outros' }
                      ].map(({ key, label }) => (
                        <div key={key} className="bg-paper/50 hover:bg-paper/80 border border-rule/70 rounded-lg px-3.5 py-2.5 focus-within:border-money transition-colors">
                          <label htmlFor={`field-benefit-${key}`} className="text-xs text-ink-muted mb-1 block">{label}</label>
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-mono text-xs text-ink-fade">R$</span>
                            <input
                              id={`field-benefit-${key}`}
                              type="text"
                              inputMode="decimal"
                              value={benefits[key]}
                              onChange={(e) => setBenefits({ ...benefits, [key]: e.target.value })}
                              className="font-mono text-base font-bold text-ink bg-transparent outline-none flex-1 py-0.5 w-full"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Resumo Rápido Pacote CLT (Espelha o card PJ) */}
                  <div className="bg-paper/70 border border-rule/80 rounded-xl p-4 mb-5">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div>
                        <span className="text-xs text-ink-muted block">Pacote CLT Estimado (Total econômico)</span>
                        <span className="font-display text-2xl font-bold text-ink">
                          R$ {clt.totalPackage.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}<span className="text-xs font-sans font-normal text-ink-muted">/mês</span>
                        </span>
                      </div>
                      <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-ink-muted bg-white border border-rule px-2.5 py-1 rounded shadow-sm">
                        Líquido: R$ {clt.net.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                    <div className="text-[11px] text-ink-muted font-sans border-t border-rule/60 pt-2 flex flex-wrap gap-x-4 gap-y-1">
                      <span>• <strong>FGTS:</strong> R$ {clt.fgts.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}/mês</span>
                      <span>• <strong>13º + Férias:</strong> R$ {Math.round((clt.decimoTerceiroNet + clt.feriasNet) / 12).toLocaleString('pt-BR')}/mês</span>
                      <span>• <strong>INSS:</strong> R$ {clt.inss.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</span>
                    </div>
                  </div>
                </div>

                {/* Gaveta de Ajustes Avançados CLT & IRPF */}
                <div className="border-t border-rule pt-4 mt-auto">
                  <button
                    id="btn-clt-advanced"
                    type="button"
                    aria-expanded={showCltAdvanced}
                    aria-controls="clt-advanced-panel"
                    onClick={() => setShowCltAdvanced(!showCltAdvanced)}
                    className="w-full flex items-center justify-between text-xs font-medium text-ink-muted hover:text-ink py-2 px-2.5 rounded-lg hover:bg-paper/60 transition-colors group"
                  >
                    <span className="flex items-center gap-2 font-semibold">
                      <span>⚙️ Opções Avançadas (PLR, Dependentes e Pensão)</span>
                      {(plrAnual || dependentes !== '0' || pensaoAlimenticia) && (
                        <span className="bg-money text-white text-[10px] font-mono uppercase px-1.5 py-0.5 rounded font-bold">Ativo</span>
                      )}
                    </span>
                    <span className="text-xs font-mono uppercase tracking-wider text-ink-fade group-hover:text-ink">{showCltAdvanced ? '▴ Ocultar' : '▾ Expandir'}</span>
                  </button>

                  {showCltAdvanced && (
                    <div
                      id="clt-advanced-panel"
                      role="region"
                      aria-labelledby="btn-clt-advanced"
                      className="mt-4 pt-4 border-t border-rule/50 space-y-5 animate-fade-in"
                    >
                      <div>
                        <label htmlFor="field-plr" className="text-xs text-ink-muted mb-1 block flex items-center gap-1.5">
                          PLR ou Bônus Anual (opcional)
                          <span className="text-[10px] bg-rule px-1.5 py-0.5 rounded text-ink-fade font-mono uppercase font-bold">Tributação Exclusiva</span>
                        </label>
                        <div className="flex items-baseline gap-2 border-b-2 border-rule pb-1.5 transition-colors focus-within:border-money">
                          <span className="font-mono text-sm text-ink-fade">R$</span>
                          <input
                            id="field-plr"
                            type="text"
                            inputMode="decimal"
                            value={plrAnual}
                            onChange={(e) => setPlrAnual(e.target.value)}
                            placeholder="0,00"
                            className="font-mono text-base text-ink bg-transparent outline-none flex-1 py-0.5 placeholder:text-ink-fade/40"
                          />
                          <span className="text-xs text-ink-fade">/ano</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="field-dependentes" className="text-xs text-ink-muted mb-1 block">Dependentes IRPF</label>
                          <select
                            id="field-dependentes"
                            value={dependentes}
                            onChange={(e) => setDependentes(e.target.value)}
                            className="font-mono text-sm text-ink bg-transparent border-b-2 border-rule pb-2 outline-none w-full focus:border-money"
                          >
                            <option value="0">0 dependentes</option>
                            <option value="1">1 dependente</option>
                            <option value="2">2 dependentes</option>
                            <option value="3">3 dependentes</option>
                            <option value="4">4 dependentes</option>
                            <option value="5">5+ dependentes</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="field-pensao" className="text-xs text-ink-muted mb-1 block">Pensão Alimentícia Judicial</label>
                          <div className="flex items-baseline gap-1.5 border-b-2 border-rule pb-1.5 transition-colors focus-within:border-money">
                            <span className="font-mono text-sm text-ink-fade">R$</span>
                            <input
                              id="field-pensao"
                              type="text"
                              inputMode="decimal"
                              value={pensaoAlimenticia}
                              onChange={(e) => setPensaoAlimenticia(e.target.value)}
                              placeholder="0,00"
                              className="font-mono text-base text-ink bg-transparent outline-none w-full py-0.5"
                            />
                          </div>
                        </div>
                      </div>
                      <p className="text-[11px] text-ink-fade leading-tight">
                        *Dependentes e pensão judicial reduzem a base de cálculo do IRPF tanto na CLT quanto no pró-labore PJ.
                      </p>
                    </div>
                  )}
                </div>
              </fieldset>

              {/* BLOCO PJ */}
              <fieldset className="bg-white border border-rule rounded-xl p-6 sm:p-8 relative shadow-sm flex flex-col justify-between h-full">
                <legend className="sr-only">Proposta PJ (Regime Alternativo)</legend>
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-money -translate-x-px -translate-y-px"></div>

                <div>
                  <div className="flex items-center gap-2 font-display text-2xl mb-6 text-ink" aria-hidden="true">
                    Proposta PJ <span className="font-mono text-[11px] text-ink-muted tracking-widest uppercase ml-auto">Alternativa</span>
                  </div>

                  {/* Valor da Proposta PJ com Alternador Mensal / Por Hora */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <label htmlFor={pjInputMode === 'mensal' ? 'field-pj-monthly' : 'field-pj-rate'} className="text-sm font-medium text-ink">
                        {pjInputMode === 'mensal' ? 'Faturamento bruto mensal' : 'Valor por hora e jornada'}
                      </label>
                      <div role="radiogroup" aria-label="Modo de preenchimento do valor PJ" className="inline-flex bg-paper border border-rule rounded-lg p-0.5 text-xs">
                        <button
                          type="button"
                          role="radio"
                          aria-checked={pjInputMode === 'mensal'}
                          onClick={() => switchPjInputMode('mensal')}
                          className={`px-2.5 py-1 rounded-md font-medium transition-colors ${pjInputMode === 'mensal' ? 'bg-ink text-paper shadow-sm' : 'text-ink-muted hover:text-ink'}`}
                        >
                          Valor Mensal
                        </button>
                        <button
                          type="button"
                          role="radio"
                          aria-checked={pjInputMode === 'hora'}
                          onClick={() => switchPjInputMode('hora')}
                          className={`px-2.5 py-1 rounded-md font-medium transition-colors ${pjInputMode === 'hora' ? 'bg-ink text-paper shadow-sm' : 'text-ink-muted hover:text-ink'}`}
                        >
                          Por Hora
                        </button>
                      </div>
                    </div>

                    {pjInputMode === 'mensal' ? (
                      <div>
                        <div className="flex items-baseline gap-2 border-b-2 border-rule pb-2 transition-colors focus-within:border-money">
                          <span className="font-mono text-lg text-ink-fade">R$</span>
                          <input
                            id="field-pj-monthly"
                            type="text"
                            inputMode="decimal"
                            value={pjMonthlyInput}
                            onChange={(e) => handlePjMonthlyChange(e.target.value)}
                            className="font-mono text-2xl sm:text-3xl font-bold text-ink bg-transparent outline-none flex-1 py-1"
                          />
                          <span className="text-xs text-ink-fade">/mês</span>
                        </div>
                        <span className="text-[11px] font-mono text-ink-fade mt-1.5 block">
                          Equivale a R$ {((parseFloat(pjRate) || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/hora (base de {hoursPerMonth}h/mês)
                        </span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="field-pj-rate" className="text-xs text-ink-muted mb-1 block">Valor da hora</label>
                          <div className="flex items-baseline gap-1.5 border-b-2 border-rule pb-2 transition-colors focus-within:border-money">
                            <span className="font-mono text-base text-ink-fade">R$</span>
                            <input
                              id="field-pj-rate"
                              type="text"
                              inputMode="decimal"
                              value={pjRate}
                              onChange={(e) => handlePjRateChange(e.target.value)}
                              className="font-mono text-xl font-bold text-ink bg-transparent outline-none flex-1 py-0.5 w-full"
                            />
                            <span className="text-xs text-ink-fade">/h</span>
                          </div>
                        </div>
                        <div>
                          <label htmlFor="field-hours" className="text-xs text-ink-muted mb-1 block">Horas/mês</label>
                          <div className="flex items-baseline gap-1.5 border-b-2 border-rule pb-2 transition-colors focus-within:border-money">
                            <input
                              id="field-hours"
                              type="text"
                              inputMode="numeric"
                              value={hoursPerMonth}
                              onChange={(e) => handleHoursChange(e.target.value)}
                              className="font-mono text-xl font-bold text-ink bg-transparent outline-none flex-1 py-0.5 w-full"
                            />
                            <span className="text-xs text-ink-fade">horas</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Regime Tributário */}
                  <div className="mb-6">
                    <label id="label-regime" className="text-sm font-medium text-ink mb-2 block">Regime tributário</label>
                    <div role="radiogroup" aria-labelledby="label-regime" className="grid grid-cols-3 border border-rule rounded-lg overflow-hidden bg-paper/40 p-1 gap-1">
                      {[
                        { id: 'simples', label: 'Simples Nacional', sub: 'Anexo III / V' },
                        { id: 'presumido', label: 'Lucro Presumido', sub: '11,33% + ISS' },
                        { id: 'mei', label: 'MEI', sub: 'Até R$ 6.750/mês' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          role="radio"
                          aria-checked={regime === item.id}
                          onClick={() => setRegime(item.id)}
                          className={`py-2 px-2 rounded-md text-center transition-all ${regime === item.id ? 'bg-ink text-paper shadow-sm font-bold' : 'text-ink-muted hover:text-ink hover:bg-white/60'}`}
                        >
                          <span className="text-xs sm:text-sm block">{item.label}</span>
                          <span className={`text-[10px] font-mono block mt-0.5 ${regime === item.id ? 'text-paper/75' : 'text-ink-fade'}`}>{item.sub}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Card de Resumo Líquido PJ & Premissas Ativas */}
                  <div className="bg-money-light/70 border border-money/20 rounded-xl p-4 mb-5">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div>
                        <span className="text-xs text-ink-muted block">Líquido PJ Estimado (após impostos e custos)</span>
                        <span className="font-display text-2xl font-bold text-money">
                          R$ {pj.net.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}<span className="text-xs font-sans font-normal text-ink-muted">/mês</span>
                        </span>
                      </div>
                      <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-money bg-white border border-money/20 px-2.5 py-1 rounded shadow-sm">
                        {pj.taxName}
                      </span>
                    </div>
                    {regime !== 'mei' && (
                      <div className="text-[11px] text-ink-muted font-sans border-t border-money/15 pt-2 flex flex-wrap gap-x-4 gap-y-1">
                        <span>• <strong>Pró-labore:</strong> R$ {pj.proLabore.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} ({proLaboreInput === 'padrao' ? 'Fator R 28%' : proLaboreInput === 'minimo' ? 'Mínimo' : 'Personalizado'})</span>
                        <span>• <strong>Contador:</strong> {mensalidadeContador ? `R$ ${mensalidadeContador}/mês` : 'Não incluído'}</span>
                        {regime === 'simples' && (
                          <span>• <strong>Anexo:</strong> {pj.anexo} ({pj.fatorRPercent.toFixed(1)}% Fator R)</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Gaveta de Ajustes Avançados PJ */}
                {regime !== 'mei' && (
                  <div className="border-t border-rule pt-4 mt-auto">
                    <button
                      id="btn-pj-advanced"
                      type="button"
                      aria-expanded={showPjAdvanced}
                      aria-controls="pj-advanced-panel"
                      onClick={() => setShowPjAdvanced(!showPjAdvanced)}
                      className="w-full flex items-center justify-between text-xs font-medium text-ink-muted hover:text-ink py-2 px-2.5 rounded-lg hover:bg-paper/60 transition-colors group"
                    >
                      <span className="flex items-center gap-2 font-semibold">
                        <span>⚙️ Ajustes Fiscais (Pró-labore, Contador e {regime === 'simples' ? 'Fator R' : 'ISS'})</span>
                        {(proLaboreInput !== 'minimo' || mensalidadeContador !== '' || faturamento12Meses !== '' || folha12Meses !== '') && (
                          <span className="bg-money text-white text-[10px] font-mono uppercase px-1.5 py-0.5 rounded font-bold">Customizado</span>
                        )}
                      </span>
                      <span className="text-xs font-mono uppercase tracking-wider text-ink-fade group-hover:text-ink">{showPjAdvanced ? '▴ Ocultar' : '▾ Expandir'}</span>
                    </button>

                    {showPjAdvanced && (
                      <div
                        id="pj-advanced-panel"
                        role="region"
                        aria-labelledby="btn-pj-advanced"
                        className="mt-4 pt-4 border-t border-rule/50 space-y-6 animate-fade-in"
                      >
                        {/* Configuração do Pró-labore */}
                        <div>
                          <label id="label-pro-labore" className="text-xs font-medium text-ink mb-2 block flex items-center gap-1.5">
                            Configuração do Pró-labore
                            <span className="text-ink-fade hover:text-ink cursor-help" title="O pró-labore é o salário do sócio. Definir em 28% (Otimizado) reduz o imposto do Simples Nacional de 15,5% para 6% (Anexo III).">
                              <Info size={13} className="inline-block" />
                            </span>
                          </label>
                          <div role="radiogroup" aria-labelledby="label-pro-labore" className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
                            {[
                              { value: 'minimo', label: 'Mínimo (R$ 1.621)' },
                              { value: 'padrao', label: 'Otimizado (28% Fator R)' },
                              { value: '3000', label: 'R$ 3.000' },
                              { value: '5000', label: 'R$ 5.000' },
                              { value: '8000', label: 'R$ 8.000' },
                              { value: 'personalizado', label: 'Outro valor' }
                            ].map((opt) => (
                              <button
                                key={opt.value}
                                type="button"
                                role="radio"
                                aria-checked={proLaboreInput === opt.value}
                                onClick={() => setProLaboreInput(opt.value)}
                                className={`py-1.5 px-2 text-[11px] font-medium rounded transition-colors border ${proLaboreInput === opt.value ? 'bg-ink text-paper border-ink' : 'text-ink-muted border-rule hover:bg-rule/30'}`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>

                          {proLaboreInput === 'personalizado' && (
                            <div className="flex items-baseline gap-2 border-b-2 border-rule pb-1.5 mt-2 transition-colors focus-within:border-money animate-fade-in">
                              <span className="font-mono text-base text-ink-fade">R$</span>
                              <input
                                id="field-pro-labore-custom"
                                type="text"
                                inputMode="decimal"
                                aria-label="Valor personalizado do pró-labore mensal"
                                value={proLaboreCustom}
                                onChange={(e) => setProLaboreCustom(e.target.value)}
                                placeholder="0,00"
                                className="font-mono text-base text-ink bg-transparent outline-none flex-1 py-0.5"
                              />
                              <span className="text-xs text-ink-fade">/mês</span>
                            </div>
                          )}
                        </div>

                        {/* Mensalidade do Contador */}
                        <div>
                          <label id="label-contador" className="text-xs font-medium text-ink mb-2 block flex items-center gap-1.5">
                            Mensalidade do contador (opcional)
                            <span className="text-[10px] bg-rule px-1.5 py-0.5 rounded text-ink-fade font-mono uppercase font-bold">Custo Mensal</span>
                          </label>
                          <div role="radiogroup" aria-labelledby="label-contador" className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                            {[
                              { value: '', label: 'Não considerar' },
                              { value: '150', label: 'R$ 150' },
                              { value: '250', label: 'R$ 250' },
                              { value: '350', label: 'R$ 350' }
                            ].map((opt) => (
                              <button
                                key={opt.value}
                                type="button"
                                role="radio"
                                aria-checked={mensalidadeContador === opt.value}
                                onClick={() => setMensalidadeContador(opt.value)}
                                className={`py-1.5 px-1 text-[11px] font-medium rounded transition-colors border ${mensalidadeContador === opt.value ? 'bg-ink text-paper border-ink' : 'text-ink-muted border-rule hover:bg-rule/30'}`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                          {mensalidadeContador !== '' && mensalidadeContador !== '150' && mensalidadeContador !== '250' && mensalidadeContador !== '350' && (
                            <div className="flex items-baseline gap-2 border-b-2 border-rule pb-1.5 transition-colors focus-within:border-money">
                              <span className="font-mono text-sm text-ink-fade">R$</span>
                              <input
                                id="field-contador-personalizado"
                                type="text"
                                inputMode="decimal"
                                aria-label="Valor personalizado da mensalidade do contador"
                                value={mensalidadeContador}
                                onChange={(e) => setMensalidadeContador(e.target.value)}
                                className="font-mono text-base text-ink bg-transparent outline-none flex-1 py-0.5"
                              />
                            </div>
                          )}
                          {['', '150', '250', '350'].indexOf(mensalidadeContador) === -1 ? null : (
                            <button
                              type="button"
                              onClick={() => setMensalidadeContador('349')}
                              className="text-[11px] text-money hover:underline block font-sans"
                            >
                              + Informar outro valor de contador
                            </button>
                          )}
                        </div>

                        {/* Opções Específicas do Simples Nacional (Histórico 12m + Termômetro Fator R) */}
                        {regime === 'simples' && (
                          <div className="space-y-4 pt-2 border-t border-rule/50">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label htmlFor="field-rbt12" className="text-xs text-ink-muted mb-1 block">
                                  Faturamento últimos 12m (RBT12)
                                </label>
                                <div className="flex items-baseline gap-1.5 border-b-2 border-rule pb-1.5 transition-colors focus-within:border-money">
                                  <span className="font-mono text-sm text-ink-fade">R$</span>
                                  <input
                                    id="field-rbt12"
                                    type="text"
                                    inputMode="decimal"
                                    value={faturamento12Meses}
                                    onChange={(e) => setFaturamento12Meses(e.target.value)}
                                    placeholder="Opcional"
                                    className="font-mono text-sm text-ink bg-transparent outline-none flex-1 py-0.5 placeholder:text-ink-fade/40"
                                  />
                                </div>
                              </div>

                              <div>
                                <label htmlFor="field-folha12" className="text-xs text-ink-muted mb-1 block">
                                  Folha de pagamento últimos 12m
                                </label>
                                <div className="flex items-baseline gap-1.5 border-b-2 border-rule pb-1.5 transition-colors focus-within:border-money">
                                  <span className="font-mono text-sm text-ink-fade">R$</span>
                                  <input
                                    id="field-folha12"
                                    type="text"
                                    inputMode="decimal"
                                    value={folha12Meses}
                                    onChange={(e) => setFolha12Meses(e.target.value)}
                                    placeholder="Opcional"
                                    className="font-mono text-sm text-ink bg-transparent outline-none flex-1 py-0.5 placeholder:text-ink-fade/40"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Termômetro Compacto do Fator R */}
                            <div className="border border-rule/60 rounded-lg p-3.5 bg-paper/40">
                              <div className="flex justify-between items-center mb-1.5">
                                <span className="text-[11px] font-mono uppercase tracking-wider text-ink-muted">Status do Fator R: {pj.fatorRPercent.toFixed(1)}%</span>
                                <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded text-white ${pj.anexo === 'III' ? 'bg-money' : 'bg-hot'}`}>
                                  {pj.anexo === 'III' ? 'Anexo III (6%)' : 'Anexo V (15,5%)'}
                                </span>
                              </div>
                              <div className="w-full bg-rule/35 h-2 rounded-full overflow-hidden relative mb-1.5">
                                <div
                                  className={`h-full rounded-full transition-all duration-300 ${pj.anexo === 'III' ? 'bg-money' : 'bg-hot'}`}
                                  style={{ width: `${Math.min(100, (pj.fatorRPercent / 28) * 100)}%` }}
                                />
                              </div>
                              <p className="text-[11px] text-ink-muted leading-tight">
                                {pj.anexo === 'III'
                                  ? '✓ Folha ≥ 28% do faturamento: enquadrado na menor alíquota (Anexo III).'
                                  : '💡 Dica: selecione o Pró-labore "Otimizado (28% Fator R)" acima para simular a redução do imposto para 6%.'}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Opções Específicas do Lucro Presumido (ISS) */}
                        {regime === 'presumido' && (
                          <div className="pt-2 border-t border-rule/50">
                            <label id="label-iss" className="text-xs font-medium text-ink mb-2 block">
                              Alíquota de ISS do seu município (2% a 5%)
                            </label>
                            <div role="radiogroup" aria-labelledby="label-iss" className="flex border border-rule rounded overflow-hidden">
                              {['2', '3', '4', '5'].map((rate) => (
                                <button
                                  key={rate}
                                  type="button"
                                  role="radio"
                                  aria-checked={issRate === rate}
                                  onClick={() => setIssRate(rate)}
                                  className={`flex-1 py-1.5 text-xs font-medium transition-colors border-r border-rule last:border-r-0 ${issRate === rate ? 'bg-ink text-paper' : 'text-ink-muted hover:bg-rule/30'}`}
                                >
                                  {rate}%
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </fieldset>
            </div>
            <div className="mt-12 pt-8 border-t border-rule flex flex-col md:flex-row items-center justify-between gap-6">
              <p className="font-display italic text-xl text-ink-muted">
                "Não é sobre qual paga mais, é sobre qual faz sentido pra tua vida."
              </p>
              <button
                onClick={() => { setShowResults(true); setShowingResults(true); setTimeout(() => document.getElementById('resultado')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
                className="inline-flex items-center gap-2.5 bg-money hover:bg-[#0a3d33] text-white px-8 py-4 rounded-xl font-sans font-bold text-base transition-all duration-300 hover:scale-[1.02] shadow-md hover:shadow-xl"
              >
                <Calculator className="w-5 h-5" />
                <span>{showingResults ? 'Recalcular comparativo' : 'Calcular comparativo'}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
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
                      O faturamento simulado de <strong className="text-ink">R$ {((parseFloat(pjRate) || 0) * (parseFloat(hoursPerMonth) || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}/mês</strong> (ou faturamento anual informado) ultrapassa o limite de <strong className="text-ink">R$ 81.000,00</strong> anuais permitido para o MEI em 2026 (verificação simplificada baseada no teto anual). 
                      Para que sua comparação seja realista e legal, recalculamos os impostos e o valor líquido abaixo automaticamente com base nas regras do <strong className="text-ink">Simples Nacional Anexo III (Fator R)</strong>.
                    </p>
                  </div>
                </div>
              )}

              {/* NOTA CONTEXTUAL: COMPARAÇÃO ASSIMÉTRICA — estilo editorial acolhedor */}
              {showAlertaDiscrepancia && (
                <div className="bg-amber-50/80 border border-amber-200/90 rounded-xl p-5 mb-8 flex gap-4 items-start relative animate-fade-in shadow-sm text-left">
                  <div className="p-2.5 rounded-lg bg-amber-100/90 text-amber-900 flex-shrink-0 mt-0.5">
                    <Scale size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-amber-950 bg-amber-200/70 border border-amber-300/60 px-2 py-0.5 rounded">
                        Nota de Contexto · Propostas Assimétricas ({(pj.gross / (clt.gross || 1)).toFixed(1).replace('.', ',')}x)
                      </span>
                    </div>
                    <p className="text-xs text-ink/90 leading-relaxed font-sans">
                      Você está comparando um salário CLT de <strong className="font-bold text-ink">R$ {clt.gross.toLocaleString('pt-BR')}/mês</strong> com um faturamento PJ de <strong className="font-bold text-ink">R$ {pj.gross.toLocaleString('pt-BR')}/mês</strong>. 
                      Como o valor bruto PJ simulado é <strong className="text-ink">{(pj.gross / (clt.gross || 1)).toFixed(1).replace('.', ',')}× maior</strong> que o salário CLT, boa parte da vantagem apresentada decorre da diferença entre os valores brutos negociados, e não exclusivamente do regime tributário.
                    </p>
                  </div>
                </div>
              )}

              {/* Passo 1: HERO RESULT CARD */}
              <div className={`border rounded-xl p-6 sm:p-8 md:p-10 mb-8 relative overflow-hidden transition-colors duration-500 shadow-sm ${
                pj.net > clt.totalPackage 
                  ? 'bg-money-light border-money/25' 
                  : 'bg-hot-light border-hot/25'
              }`}>
                {/* Linha de acento lateral com bordas suaves */}
                <div className={`absolute top-0 left-0 bottom-0 w-2.5 rounded-l-xl ${pj.net > clt.totalPackage ? 'bg-money' : 'bg-hot'}`} />
                
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  <div className="max-w-xl">
                    <div className="flex flex-wrap items-center gap-2 mb-2.5">
                      <span className="font-mono text-xs uppercase tracking-widest text-ink-muted">Recomendação</span>
                      <span className={`text-xs font-semibold font-mono uppercase tracking-wider px-2 py-0.5 rounded border flex items-center gap-1.5 shadow-sm ${impactoGeralCor}`}>
                        <span>{impactoBolinha}</span>
                        <span>{impactoGeralLabel}</span>
                      </span>
                    </div>

                    <h3 className="font-display text-3xl sm:text-4xl text-ink font-bold leading-tight mb-3">
                      {pj.net > clt.totalPackage ? (
                        <>A opção <span className="text-money italic font-bold">PJ</span> é mais vantajosa para você.</>
                      ) : (
                        <>A opção <span className="text-hot italic font-bold">CLT</span> é mais vantajosa para você.</>
                      )}
                    </h3>

                    {/* Resumo Executivo Claro e Útil */}
                    <p className="text-sm sm:text-base text-ink-muted font-sans leading-relaxed">
                      {pj.net > clt.totalPackage ? (
                        <>No cenário simulado, o modelo <strong className="text-ink font-semibold">PJ</strong> entrega uma vantagem líquida real de <strong className="text-money font-bold">R$ {Math.abs(pj.net - clt.totalPackage).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}/mês</strong> em relação a todo o pacote CLT (salário líquido + FGTS + 13º + férias + benefícios).</>
                      ) : (
                        <>No cenário simulado, o pacote <strong className="text-ink font-semibold">CLT completo</strong> supera a proposta PJ em <strong className="text-hot font-bold">R$ {Math.abs(pj.net - clt.totalPackage).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}/mês</strong> ao considerar FGTS, 13º, férias remuneradas e benefícios corporativos.</>
                      )}
                    </p>

                    <p className="text-xs text-ink-fade font-mono mt-3 pt-3 border-t border-rule/30">
                      Comparação baseada em: CLT R$ {clt.gross.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/mês (salário bruto) vs PJ R$ {pj.gross.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/mês (faturamento bruto).
                    </p>
                  </div>

                  {/* KPI Card com Valor sem quebra de linha */}
                  <div className={`border rounded-xl p-5 sm:p-6 min-w-[280px] lg:max-w-[320px] lg:text-right flex flex-col justify-center bg-white/85 backdrop-blur-sm shadow-sm ${
                    pj.net > clt.totalPackage ? 'border-money/20' : 'border-hot/20'
                  }`}>
                    <span className="font-mono text-xs uppercase tracking-wider text-ink-muted block mb-1.5">
                      {pj.net > clt.totalPackage ? 'Rendimento Extra Mensal (PJ)' : 'Rendimento Extra Mensal (CLT)'}
                    </span>
                    
                    {/* Número Principal com R$ e Valor na mesma linha */}
                    <div className="flex items-baseline justify-start lg:justify-end gap-1.5 mb-2 whitespace-nowrap overflow-hidden">
                      <span className={`font-display text-2xl sm:text-3xl font-bold ${pj.net > clt.totalPackage ? 'text-money' : 'text-hot'}`}>
                        + R$
                      </span>
                      <span className={`font-display text-4xl sm:text-5xl lg:text-[54px] font-black tracking-tight leading-none ${pj.net > clt.totalPackage ? 'text-money' : 'text-hot'}`}>
                        {Math.abs(pj.net - clt.totalPackage).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </span>
                    </div>

                    <span className="text-xs text-ink-muted font-sans block mb-3">
                      Equivale a <strong className="text-ink font-semibold">{Math.abs(((pj.net - clt.totalPackage) / (pj.net > clt.totalPackage ? clt.totalPackage : pj.net)) * 100).toFixed(1).replace('.', ',')}%</strong> a mais de rendimento.
                    </span>

                    <span className={`font-mono text-xs uppercase tracking-wider text-ink-muted block border-t pt-3 ${
                      pj.net > clt.totalPackage ? 'border-money/15' : 'border-hot/15'
                    }`}>
                      Diferença anual: <strong className="text-ink">+ R$ {Math.abs((pj.net - clt.totalPackage) * 12).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}/ano</strong>
                    </span>
                  </div>
                </div>

                {/* Barra Visual Comparativa CLT vs PJ */}
                <div className="mt-8 pt-6 border-t border-rule/50">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 text-xs font-mono uppercase tracking-wider text-ink-muted mb-3.5">
                    <span className="font-bold flex items-center gap-1.5 text-ink">
                      📊 Comparativo Visual de Rendimento
                    </span>
                    <span className="text-[11px] font-sans font-normal text-ink-fade">
                      Pacote CLT completo vs Líquido PJ
                    </span>
                  </div>

                  <div className="space-y-3.5 font-sans">
                    {/* Barra CLT */}
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-medium text-ink flex items-center gap-1.5">
                          <span className={`w-2.5 h-2.5 rounded-full ${clt.totalPackage >= pj.net ? 'bg-money' : 'bg-stone-400'}`}></span>
                          Pacote Total CLT <span className="text-[11px] text-ink-fade hidden sm:inline">(Salário Líquido + Provisões + Benefícios)</span>
                        </span>
                        <span className="font-mono font-bold text-ink">
                          R$ {clt.totalPackage.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                          <span className="text-[11px] font-normal text-ink-fade ml-1">({cltBarPercent}%)</span>
                        </span>
                      </div>
                      <div className="w-full bg-white/90 border border-rule/70 h-3.5 rounded-full overflow-hidden p-0.5 shadow-inner">
                        <div 
                          className={`h-full rounded-full transition-all duration-700 ease-out ${clt.totalPackage >= pj.net ? 'bg-money' : 'bg-stone-400'}`}
                          style={{ width: `${Math.max(cltBarPercent, 5)}%` }}
                        />
                      </div>
                    </div>

                    {/* Barra PJ */}
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-medium text-ink flex items-center gap-1.5">
                          <span className={`w-2.5 h-2.5 rounded-full ${pj.net > clt.totalPackage ? 'bg-money' : 'bg-stone-400'}`}></span>
                          Líquido Real PJ <span className="text-[11px] text-ink-fade hidden sm:inline">(Faturamento Bruto - Impostos - Custos)</span>
                        </span>
                        <span className="font-mono font-bold text-ink">
                          R$ {pj.net.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                          <span className="text-[11px] font-normal text-ink-fade ml-1">({pjBarPercent}%)</span>
                        </span>
                      </div>
                      <div className="w-full bg-white/90 border border-rule/70 h-3.5 rounded-full overflow-hidden p-0.5 shadow-inner">
                        <div 
                          className={`h-full rounded-full transition-all duration-700 ease-out ${pj.net > clt.totalPackage ? 'bg-money' : 'bg-stone-400'}`}
                          style={{ width: `${Math.max(pjBarPercent, 5)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA ANCORADO — aparece sempre imediatamente após o Hero Card */}
              <div className="border border-rule/60 rounded-xl p-5 mb-6 animate-fade-in font-sans bg-paper relative overflow-hidden shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="max-w-xl">
                    <p className="font-mono text-xs uppercase tracking-widest text-ink-fade mb-1.5">Próximo passo recomendado</p>
                    <p className="text-sm text-ink leading-relaxed">
                      {pj.net > clt.totalPackage ? (
                        <>
                          Esta simulação aponta <strong className="text-money">+R$ {Math.abs(pj.net - clt.totalPackage).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}/mês</strong> a favor do PJ.
                          {' '}Um contador pode confirmar esse número e identificar otimizações adicionais em 30 minutos.
                        </>
                      ) : (
                        <>
                          Neste cenário, a CLT aparece mais vantajosa em <strong className="text-ink">R$ {Math.abs(pj.net - clt.totalPackage).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}/mês</strong>.
                          {' '}Um contador pode confirmar se esse resultado se mantém no seu perfil específico em 30 minutos.
                        </>
                      )}
                    </p>
                  </div>
                  <a
                    href="/go/manasses"
                    rel="sponsored nofollow"
                    className="group inline-flex items-center gap-2 rounded transition-all duration-300 font-bold whitespace-nowrap shadow-sm hover:shadow-md bg-[#0c4a3e] text-[#f5f1e8] hover:bg-[#0a3d33] hover:scale-[1.02] px-5 py-3 text-sm flex-shrink-0"
                  >
                    Falar com contador
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </div>
              </div>

              {/* PONTO DE EQUILÍBRIO PJ (BREAK-EVEN) & COMPARTILHAMENTO VIRAL */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8 animate-fade-in font-sans">
                {/* Card Break-Even */}
                <div className="lg:col-span-2 bg-white border border-rule/70 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="text-money w-4 h-4" />
                    <span className="font-mono text-xs uppercase tracking-wider text-ink font-bold">
                      Ponto de Equilíbrio PJ (Break-Even)
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-sans text-xs pt-1">
                    <div className="bg-paper/40 border border-rule/50 rounded-lg p-3">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted block mb-0.5">Faturamento Mínimo</span>
                      <span className="font-display text-xl font-bold text-ink block">
                        R$ {breakEven.monthlyGross.toLocaleString('pt-BR')}<span className="text-xs font-sans font-normal text-ink-muted">/mês</span>
                      </span>
                      <span className="text-xs text-ink-fade leading-tight block mt-0.5">Para empatar com pacote CLT</span>
                    </div>

                    <div className="bg-paper/40 border border-rule/50 rounded-lg p-3">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted block mb-0.5">Valor Hora Mínimo</span>
                      <span className="font-display text-xl font-bold text-ink block">
                        R$ {breakEven.hourlyRate.toLocaleString('pt-BR')}<span className="text-xs font-sans font-normal text-ink-muted">/h</span>
                      </span>
                      <span className="text-xs text-ink-fade leading-tight block mt-0.5">Em {hoursPerMonth}h mensais</span>
                    </div>

                    <div className="bg-paper/40 border border-rule/50 rounded-lg p-3">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted block mb-0.5">Multiplicador Ideal</span>
                      <span className="font-display text-xl font-bold text-money block">
                        {breakEvenMultiplier}x <span className="text-xs font-sans font-normal text-ink-muted">do CLT</span>
                      </span>
                      <span className="text-xs text-ink-fade leading-tight block mt-0.5">Fator de reposição total</span>
                    </div>
                  </div>
                </div>

                {/* Barra de Compartilhamento Viral */}
                <div className="bg-white border border-rule/70 rounded-xl p-5 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Share2 className="text-money w-4 h-4" />
                      <span className="font-mono text-xs uppercase tracking-wider text-ink font-bold">
                        Compartilhar Simulação
                      </span>
                    </div>
                    <p className="text-xs text-ink-muted leading-tight font-sans mb-3">
                      Envie esta conta para amigos, sócios ou recrutadores com link direto.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                    <button
                      type="button"
                      onClick={handleShareWhatsApp}
                      className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-4 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Enviar no WhatsApp
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="inline-flex items-center justify-center gap-2 bg-paper hover:bg-rule/40 border border-rule text-ink px-4 py-2.5 rounded-lg text-xs font-mono font-medium transition-all"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="w-4 h-4 text-money" />
                          <span className="text-money font-bold">Link Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-ink-muted" />
                          <span>Copiar Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Passo 2: COMPARE & Custos Operacionais */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr] gap-8 mt-12 mb-10 pt-10 border-t border-rule items-start">
                <div className="flex flex-col">
                  <span className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-2">Como CLT</span>
                  <span className={`font-display text-5xl text-ink leading-none mb-2 ${clt.totalPackage >= pj.net ? 'text-money' : ''}`}>R$ {clt.totalPackage.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                  <span className="text-sm text-ink-muted">Pacote total: líquido + 13º + férias + FGTS</span>
                </div>

                <div className="hidden md:block w-full h-full min-h-[100px] bg-rule"></div>

                <div className="flex flex-col">
                  <span className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-2">Como PJ</span>
                  <span className={`font-display text-5xl text-ink leading-none mb-2 ${pj.net > clt.totalPackage ? 'text-money' : ''}`}>R$ {pj.net.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                  <span className="text-sm text-ink-muted mb-4 font-sans">
                    {meiExcedido 
                      ? `Simples Anexo III (Teto MEI excedido) — ${pj.taxName}` 
                      : regime === 'mei' 
                        ? 'MEI - Microempreendedor Individual' 
                        : regime === 'presumido' 
                          ? 'Lucro Presumido (Carga ~14,5%)' 
                          : pj.taxName}
                  </span>

                  {mensalidadeContador && parseFloat(mensalidadeContador) > 0 && (
                    <div className="bg-white/60 border border-rule rounded p-4 font-sans text-xs animate-fade-in shadow-sm w-full">
                      <div className="flex justify-between py-1 border-b border-rule/50">
                        <span className="text-ink-muted font-medium">Líquido Tributário (PJ)</span>
                        <span className="font-mono text-ink font-semibold">R$ {pj.net.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-rule/50">
                        <span className="text-ink-muted font-medium">Contabilidade (Custo Operacional)</span>
                        <span className="font-mono text-hot">-R$ {parseFloat(mensalidadeContador).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between pt-1.5 font-bold text-money">
                        <span>Líquido após custos opcionais</span>
                        <span className="font-mono">R$ {pj.netMonthlyPosCustos.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ACORDEÃO — botão de toggle para os detalhamentos técnicos */}
              <div className="mt-8 mb-2">
                <button
                  type="button"
                  id="btn-detalhamento"
                  aria-expanded={showDetalhamento}
                  aria-controls="detalhamento-tecnico"
                  onClick={() => setShowDetalhamento(!showDetalhamento)}
                  className="w-full flex items-center justify-between gap-3 py-4 px-5 border border-rule rounded-lg bg-white hover:bg-paper transition-colors font-sans group shadow-sm focus-visible:ring-2 focus-visible:ring-money focus-visible:outline-none"
                >
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-xs uppercase tracking-widest text-ink-muted">
                      {showDetalhamento ? 'Ocultar detalhamento técnico' : 'Ver detalhamento completo'}
                    </span>
                    <span className="text-xs font-mono bg-rule/50 text-ink-fade px-1.5 py-0.5 rounded">
                      Fator R · Simulador · Previdência · Impostos linha a linha
                    </span>
                  </span>
                  <span className={`text-ink-muted transition-transform duration-300 ${showDetalhamento ? 'rotate-180' : ''}`} aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </button>
              </div>

              {showDetalhamento && (
              <div id="detalhamento-tecnico" role="region" aria-labelledby="btn-detalhamento" className="animate-fade-in">

              {/* Passo 3: Qualidade dos Dados e Potencial de Planejamento */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 font-sans">
                {/* Qualidade dos Dados */}
                <div className={`border rounded-lg p-5 flex gap-3.5 items-start shadow-sm ${
                  pj.contabilidadeMetadata.dadosQualidade === 'completos' 
                    ? 'bg-green-50/50 border-green-200/50' 
                    : pj.contabilidadeMetadata.dadosQualidade === 'revisao_especializada' 
                      ? 'bg-red-50/50 border-red-200/50' 
                      : 'bg-yellow-50/50 border-yellow-200/50'
                }`}>
                  <span className="text-lg">
                    {pj.contabilidadeMetadata.dadosQualidade === 'completos' ? '🟢' : pj.contabilidadeMetadata.dadosQualidade === 'revisao_especializada' ? '🔴' : '🟡'}
                  </span>
                  <div>
                    <h5 className="text-sm font-bold text-ink mb-1">{pj.contabilidadeMetadata.dadosQualidadeLabel}</h5>
                    <p className="text-xs text-ink-muted leading-relaxed">{pj.contabilidadeMetadata.dadosQualidadeMsg}</p>
                  </div>
                </div>

                {/* Potencial de Planejamento Tributário */}
                <div className={`border rounded-lg p-5 flex gap-3.5 items-start shadow-sm ${
                  pj.contabilidadeMetadata.potencialPlanejamento === 'baixo' 
                    ? 'bg-green-50/50 border-green-200/50' 
                    : pj.contabilidadeMetadata.potencialPlanejamento === 'medio' 
                      ? 'bg-yellow-50/50 border-yellow-200/50' 
                      : 'bg-red-50/50 border-red-200/50'
                }`}>
                  <span className="text-lg">
                    {pj.contabilidadeMetadata.potencialPlanejamento === 'baixo' ? '🟢' : pj.contabilidadeMetadata.potencialPlanejamento === 'medio' ? '🟡' : '🔴'}
                  </span>
                  <div>
                    <h5 className="text-sm font-bold text-ink mb-1">Potencial de otimização identificado: {pj.contabilidadeMetadata.potencialPlanejamentoLabel}</h5>
                    <p className="text-xs text-ink-muted leading-relaxed">{pj.contabilidadeMetadata.potencialPlanejamentoMsg}</p>
                    
                    <div className="mt-2 text-xs text-ink-fade leading-normal font-sans border-t border-rule/30 pt-1.5">
                      <strong>Motivos:</strong> {
                        regime === 'presumido' 
                          ? 'Regime de Lucro Presumido selecionado.' 
                          : (pj.fatorRPercent >= 26 && pj.fatorRPercent <= 30) 
                            ? 'Fator R limítrofe entre o Anexo III e o Anexo V.' 
                            : pj.fatorRPercent < 28 
                              ? 'Enquadramento atual no Anexo V.' 
                              : 'Estrutura tributária atual já está próxima do ideal matemático simulado.'
                      }
                    </div>
                  </div>
                </div>
              </div>

              {/* Passo 4: Fator R (Apenas se Simples Nacional) */}
              {regime === 'simples' && (
                <div className="border border-rule rounded-xl p-6 bg-white shadow-sm mb-8 animate-fade-in">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-display text-xl font-bold text-ink">Análise do Fator R (Simples Nacional)</h4>
                    <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded text-white ${pj.anexo === 'III' ? 'bg-money' : 'bg-hot'}`}>
                      {pj.anexo === 'III' ? '🟢 Anexo III' : '🔴 Anexo V'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1 text-ink">
                        <span>{FatorRLabel}: {pj.fatorRPercent > 100 ? '>100%' : `${pj.fatorRPercent.toFixed(2).replace('.', ',')}%`}</span>
                        <span>Meta: 28%</span>
                      </div>
                      
                      <div className="w-full bg-rule/30 h-4 rounded-full overflow-hidden relative mb-2.5">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${pj.anexo === 'III' ? 'bg-money' : 'bg-hot'}`}
                          style={{ width: `${Math.min(100, (pj.fatorRPercent / 28) * 100)}%` }}
                        ></div>
                        <div className="absolute top-0 bottom-0 left-[100%] w-0.5 bg-ink/40" style={{ left: '28%' }}></div>
                      </div>

                      <div className="flex justify-between items-center text-[11px] text-ink-fade mt-1.5 font-sans">
                        <span>Fator R = Folha 12m ÷ RBT12</span>
                        <span className="flex items-center gap-1.5">
                          <span>Dados do Fator R:</span>
                          <span className="font-mono text-[11px] uppercase font-bold px-1.5 py-0.5 rounded border bg-paper-dark text-ink-muted border-rule/80">
                            {pj.contabilidadeMetadata.nivelConfiancaFatorR === 'alta' 
                              ? 'Dados Reais' 
                              : pj.contabilidadeMetadata.nivelConfiancaFatorR === 'media' 
                                ? 'Histórico Parcial' 
                                : 'Estimados por Referência'}
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="bg-paper/30 border border-rule/50 rounded-lg p-4 font-mono text-xs text-ink-muted">
                      <div className="font-semibold text-ink mb-2">Demonstração da conta:</div>
                      <div className="mb-1.5 flex justify-between">
                        <span>Folha de Pagamento 12m:</span>
                        <span className="text-ink">R$ {pj.folhaUtilizada.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="mb-2.5 flex justify-between">
                        <span>Faturamento 12m (RBT12):</span>
                        <span className="text-ink">R$ {pj.rbt12Utilizado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="border-t border-rule/60 pt-2 flex justify-between font-bold text-ink text-sm">
                        <span>Resultado do Fator R:</span>
                        <span>{pj.folhaUtilizada.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} ÷ {pj.rbt12Utilizado.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} = {pj.fatorRPercent.toFixed(2).replace('.', ',')}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3.5 border-t border-rule/40 text-xs text-ink-muted leading-relaxed font-sans text-left">
                    <strong>Nota do cenário</strong>: {FatorRDesc}
                    <br />
                    <span className="text-[11px] text-ink-fade mt-1.5 block leading-relaxed">{pj.motivoEnquadramento}</span>

                    {pj.proLabore > pj.gross && (
                      <div className="bg-[#fff3cd] border border-[#ffeeba] text-[#856404] p-3.5 rounded-lg text-xs leading-relaxed font-sans mt-3.5 flex items-start gap-2 animate-fade-in shadow-sm">
                        <span className="text-sm">⚠️</span>
                        <span>
                          <strong>Alerta de Viabilidade</strong>: O faturamento informado é inferior ao pró-labore considerado para fins previdenciários. Este cenário normalmente indica uma empresa economicamente inviável ou uma simulação exploratória.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Passo 5: Simulador de Otimização (Apenas se Anexo V) */}
              {regime === 'simples' && pj.anexo === 'V' && pj.fatorROptimization && (
                <div className="border border-money/30 rounded-xl p-6 bg-white shadow-sm mb-8 animate-fade-in text-left">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="text-money" size={22} />
                    <h4 className="font-display text-xl font-bold text-ink">Simulador de Otimização Tributária</h4>
                  </div>

                  <p className="text-sm text-ink-muted mb-4 font-sans leading-relaxed">
                    Sua empresa está tributada no Anexo V. Atingindo a folha mínima do Fator R (28%), você pode migrar para o Anexo III.
                  </p>

                  <div className="bg-money-light border border-money/20 rounded-lg p-4 mb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <span className="text-xs text-ink-fade font-mono uppercase tracking-wider block mb-0.5">Folha adicional necessária para a meta de 28%:</span>
                      <span className="text-lg font-bold text-ink">
                        R$ {pj.fatorROptimization.folhaFaltante12m.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} anual (ou R$ {pj.fatorROptimization.folhaFaltanteMensal.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}/mês)
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-money">
                      Fator R necessário: + {pj.fatorROptimization.pontosPercentuaisFaltantes.toFixed(2).replace('.', ',')}%
                    </div>
                  </div>

                  {/* Comparativo de Impostos e Previdência */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5 font-mono text-xs text-ink-muted">
                    <div className="bg-paper/30 border border-rule/50 rounded-lg p-4">
                      <div className="font-semibold text-ink mb-2">1. Comparativo de Caixa Mensal:</div>
                      <div className="flex justify-between py-1 border-b border-rule/40 pl-2 text-[11px] text-ink-fade">
                        <span>DAS Atual (Anexo V):</span>
                        <span className="font-mono">R$ {pj.simplesDAS.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-rule/40 pl-2 text-[11px] text-ink-fade">
                        <span>DAS Projetado (Anexo III):</span>
                        <span className="font-mono">R$ {pj.fatorROptimization.dasOtimizado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-rule/40">
                        <span className="font-medium">(=) Economia no DAS:</span>
                        <span className="text-money font-semibold font-mono">+R$ {pj.fatorROptimization.economiaDas.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-rule/40">
                        <span>INSS pessoal adicional:</span>
                        <span className="text-hot font-semibold font-mono">-R$ {pj.fatorROptimization.inssAdicional.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-rule/40">
                        <span>IRPF pessoal adicional:</span>
                        <span className="text-hot font-semibold font-mono">-R$ {pj.fatorROptimization.irpfAdicional.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between pt-2 font-bold text-ink text-sm">
                        <span>Ganho tributário real no bolso:</span>
                        <span className={pj.fatorROptimization.ganhoLiquidoReal > 0 ? 'text-money' : 'text-hot'}>
                          {pj.fatorROptimization.ganhoLiquidoReal > 0 ? '+' : ''}R$ {pj.fatorROptimization.ganhoLiquidoReal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/mês
                        </span>
                      </div>
                    </div>

                    <div className="bg-paper/30 border border-rule/50 rounded-lg p-4 flex flex-col justify-center">
                      <span className="text-xs text-ink-fade font-sans block mb-1">Potencial de Economia Identificado</span>
                      {pj.fatorROptimization.ganhoLiquidoReal > 0 ? (
                        <div className="bg-green-50 border border-green-200 rounded-md p-3 font-sans">
                          <div className="flex items-center gap-1.5 text-xs text-green-700 font-bold mb-1">
                            <span>🟢</span>
                            <span>Economia Potencial</span>
                            <span className={`ml-auto text-[11px] font-mono uppercase font-bold px-1.5 py-0.5 rounded border flex items-center gap-1 ${
                              pj.fatorROptimization.ganhoLiquidoReal < 100 
                                ? 'bg-green-50 text-green-700 border-green-200' 
                                : pj.fatorROptimization.ganhoLiquidoReal < 500 
                                  ? 'bg-yellow-50 text-yellow-700 border-yellow-200' 
                                  : 'bg-red-50 text-red-700 border-red-200'
                            }`}>
                              <span>{pj.fatorROptimization.ganhoLiquidoReal < 100 ? '🟢' : pj.fatorROptimization.ganhoLiquidoReal < 500 ? '🟡' : '🔴'}</span>
                              <span>{pj.fatorROptimization.ganhoLiquidoReal < 100 ? 'Impacto Baixo' : pj.fatorROptimization.ganhoLiquidoReal < 500 ? 'Impacto Moderado' : 'Impacto Alto'}</span>
                            </span>
                          </div>
                          <p className="text-sm font-bold text-green-800 leading-tight">
                            R$ {pj.fatorROptimization.ganhoLiquidoReal.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}/mês
                          </p>
                          <p className="text-xs text-green-700 font-medium">
                            ou R$ {Math.round(pj.fatorROptimization.ganhoLiquidoReal * 12).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}/ano
                          </p>
                          <p className="text-xs text-green-600/80 mt-1 leading-normal">
                            Uma análise contábil pode confirmar se essa economia é viável na prática.
                          </p>
                        </div>
                      ) : (
                        <div className="bg-red-50 border border-red-200 rounded-md p-3 font-sans">
                          <div className="flex items-center gap-1.5 text-xs text-red-700 font-bold mb-1">
                            <span>🔴</span>
                            <span>Diferença negativa no bolso</span>
                          </div>
                          <p className="text-sm font-bold text-red-800 leading-tight">
                            R$ {pj.fatorROptimization.ganhoLiquidoReal.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}/mês
                          </p>
                          <p className="text-xs text-red-700 font-medium">
                            ou R$ {Math.round(pj.fatorROptimization.ganhoLiquidoReal * 12).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}/ano
                          </p>
                          <p className="text-xs text-red-600/80 mt-1 leading-normal">
                            A economia de DAS do Anexo III não cobre o aumento de impostos pessoais (INSS e IRPF) do pró-labore. Melhor permanecer no Anexo V.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-ink-fade leading-relaxed font-sans italic">
                    *Esta é uma projeção matemática simplificada considerando que toda a folha adicional seria alocada no pró-labore. Na prática, a folha do Fator R pode ser composta por funcionários, estagiários e encargos.
                  </p>
                </div>
              )}

              {/* Passo 6: Análise Previdenciária Acumulada */}
              {regime !== 'mei' && (
                <div className="border border-rule rounded-xl p-6 bg-white shadow-sm mb-8 animate-fade-in font-sans text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-rule/50">
                    <div className="flex items-center gap-2">
                      <Users className="text-ink-muted" size={20} />
                      <h4 className="font-display text-lg font-bold text-ink">Diferença de contribuição previdenciária</h4>
                    </div>
                    <span className="text-xl font-bold text-ink whitespace-nowrap">
                      R$ {Math.abs(clt.inssAnualCLT - pj.inssAnualPJ).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}/ano
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 font-mono text-xs">
                    <div className="bg-paper/30 border border-rule/50 rounded-lg p-3 flex justify-between items-center">
                      <span className="text-ink-fade uppercase tracking-wider text-xs">CLT (INSS Anual)</span>
                      <span className="font-bold text-ink font-mono">R$ {clt.inssAnualCLT.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}/ano</span>
                    </div>

                    <div className="bg-paper/30 border border-rule/50 rounded-lg p-3 flex justify-between items-center">
                      <span className="text-ink-fade uppercase tracking-wider text-xs">PJ (INSS Pró-labore Anual)</span>
                      <span className="font-bold text-ink font-mono">R$ {pj.inssAnualPJ.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}/ano</span>
                    </div>
                  </div>

                  <p className="text-xs text-ink-fade leading-relaxed bg-paper p-3.5 rounded border border-rule">
                    ℹ️ <strong>Informação Previdenciária</strong>: A contribuição previdenciária anual estimada (INSS retido) influencia diretamente benefícios governamentais essenciais como o valor da aposentadoria por tempo/idade, auxílio-doença, pensão por morte e salário-maternidade. Uma contribuição menor resulta em menor custo previdenciário imediato, mas pode reduzir a cobertura ou o valor de benefícios futuros. O impacto real depende do histórico contributivo acumulado de cada segurado.
                  </p>
                </div>
              )}

              {/* Detailed Breakdown */}
              <div className="grid md:grid-cols-2 gap-8 mb-8 text-left">
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
                    {clt.plr > 0 && (
                      <div className="flex justify-between py-2 border-b border-rule">
                        <span className="text-ink-muted">PLR / Bônus (mensalizado)</span>
                        <span className="text-money">R$ {clt.plr.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                    )}
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

                    {/* Detalhamento de Lucro Presumido se aplicável */}
                    {regime === 'presumido' && !meiExcedido && (
                      <>
                        <div className="flex justify-between py-1 border-b border-rule pl-4 text-xs font-mono text-ink-muted">
                          <span>- IRPJ (4,80%)</span>
                          <span>R$ {pj.lpIRPJ.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-rule pl-4 text-xs font-mono text-ink-muted">
                          <span>- CSLL (2,88%)</span>
                          <span>R$ {pj.lpCSLL.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-rule pl-4 text-xs font-mono text-ink-muted">
                          <span>- PIS (0,65%)</span>
                          <span>R$ {pj.lpPIS.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-rule pl-4 text-xs font-mono text-ink-muted">
                          <span>- COFINS (3,00%)</span>
                          <span>R$ {pj.lpCOFINS.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-rule pl-4 text-xs font-mono text-ink-muted">
                          <span>- ISS ({issRate}%)</span>
                          <span>R$ {pj.lpISS.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        {pj.lpAdicionalIRPJ > 0 && (
                          <div className="flex justify-between py-1 border-b border-rule pl-4 text-xs font-mono text-ink-muted">
                            <span>- Adicional de IRPJ (10%)</span>
                            <span>R$ {pj.lpAdicionalIRPJ.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </div>
                        )}
                      </>
                    )}

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
                    <div className="flex justify-between py-2 border-b border-rule">
                      <div>
                        <span className="text-ink-muted block">Distribuição de Dividendos</span>
                        <span className="text-xs text-ink-fade leading-tight block font-sans max-w-[260px] mt-0.5">
                          Dividendos líquidos distribuídos após a aplicação das regras tributárias consideradas nesta simulação.
                        </span>
                      </div>
                      <span className="text-money font-semibold align-top pt-1">Isento (Regras Atuais)</span>
                    </div>
                    <div className="flex justify-between pt-3 mt-1 font-semibold border-t-2 border-money/30">
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

              {/* Passo 7: O que um contador poderia analisar neste caso */}
              <div className="border border-rule rounded-xl p-6 bg-white shadow-sm mb-6 animate-fade-in font-sans text-left">
                <h4 className="font-display text-lg font-bold text-ink mb-3.5">O que um contador poderia analisar neste caso</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-ink-muted">
                  {pj.contabilidadeMetadata.checklistContador.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-start py-0.5">
                      <span className="text-money flex-shrink-0 font-bold">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Passo 8: Validação Contábil (O que a calculadora não valida automaticamente) */}
              <div className="border border-rule rounded-xl p-6 bg-white shadow-sm mb-6 animate-fade-in font-sans text-left">
                <h4 className="font-display text-sm font-bold text-ink mb-3 flex items-center gap-1.5">
                  <AlertCircle className="text-ink-fade flex-shrink-0" size={17} />
                  <span>O que a calculadora não consegue validar automaticamente:</span>
                </h4>
                
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs text-ink-fade list-disc pl-5 mb-4">
                  <li>Enquadramento de CNAEs impeditivos na receita</li>
                  <li>Histórico do Fator R consolidado de 12 meses</li>
                  <li>Funcionários registrados e despesas de pessoal da PJ</li>
                  <li>Benefícios fiscais e isenções municipais específicas de ISS</li>
                  <li>Estratégia fiscal para a distribuição de dividendos isentos</li>
                  <li>Planejamento societário e Holding Patrimonial</li>
                  <li>Mudança ou transição planejada de regime tributário</li>
                </ul>
                
                <div className="bg-[#fff3cd] border border-[#ffeeba] text-[#856404] p-3 rounded text-xs leading-relaxed font-sans flex items-start gap-2">
                  <span>⚠️</span>
                  <span>Sua simulação identificou pontos críticos que exigem validação contábil especializada.</span>
                </div>
              </div>

              {/* Passo 9: CTA Manassés Contabilidade (Contextual dosado pelo OportunidadeScore) */}
              {pj.contabilidadeMetadata.showContadorCTA && (
                <div className="rounded-xl p-6 md:p-8 mb-8 animate-fade-in font-sans bg-[#0c4a3e] text-[#f5f1e8] border border-[#0c4a3e]/10 relative overflow-hidden shadow-md text-left">
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#f5f1e8 1px, transparent 1px), linear-gradient(90deg, #f5f1e8 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                  
                  {pj.contabilidadeMetadata.oportunidadeScore >= 8 && (
                    <span className="absolute top-0 right-0 bg-[#f5f1e8] text-[#0c4a3e] font-mono text-[11px] uppercase font-bold tracking-widest px-3 py-1 rounded-bl-lg shadow-sm">
                      Recomendado
                    </span>
                  )}
                  
                  <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between font-sans relative z-10">
                    <div className="max-w-xl">
                      <span className="font-mono text-xs uppercase tracking-[0.15em] text-[#f5f1e8]/50 block mb-2 font-bold">
                        Parceiro Contábil Recomendado
                      </span>
                      <p className={`leading-relaxed text-[#f5f1e8] ${pj.contabilidadeMetadata.oportunidadeScore >= 8 ? 'text-base font-semibold' : 'text-sm'}`}>
                        {pj.contabilidadeMetadata.ctaCaso === 'equilibrio' 
                          ? `A diferença encontrada foi de apenas R$ ${Math.abs(pj.net - clt.totalPackage).toLocaleString('pt-BR', { maximumFractionDigits: 0 })} por mês. Nessa situação, benefícios CLT, aposentadoria, estabilidade e estratégia empresarial podem ser tão relevantes quanto os impostos. Recomendamos falar com a equipe da Manassés.`
                          : pj.contabilidadeMetadata.ctaTexto}
                      </p>
                      <p className="text-xs text-[#f5f1e8]/75 mt-2">
                        Assessoria especializada no Fator R para profissionais de TI e suporte dedicado via WhatsApp. <strong>50% de desconto na primeira mensalidade!</strong>
                      </p>
                    </div>
                    
                    <div className="flex-shrink-0 font-sans">
                      <a
                        href="/go/manasses"
                        rel="sponsored nofollow"
                        className="group inline-flex items-center gap-2 rounded transition-all duration-300 font-bold whitespace-nowrap shadow-sm hover:shadow-md bg-[#f5f1e8] text-[#0c4a3e] hover:bg-white hover:scale-[1.02] px-6 py-4 text-base"
                      >
                        Falar com especialista
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Passo 10: LIMITAÇÕES DA SIMULAÇÃO (RODAPÉ DISCRETO) */}
              <div className="mt-8 pt-5 border-t border-rule/30 text-center font-sans">
                <p className="text-xs text-ink-fade leading-relaxed max-w-2xl mx-auto">
                  *Esta ferramenta é um simulador simplificado com finalidade exclusivamente informativa e de apoio à tomada de decisão. As estimativas tributárias não constituem orientação contábil formal ou aconselhamento jurídico e devem ser validadas individualmente com um profissional qualificado antes de qualquer enquadramento societário ou tributário.
                </p>
              </div>

              </div>)} {/* fim do acordeão showDetalhamento */}

            </div>
          </section>
          )}
        </main>

        <Footer />
      </div >
    </>
  )
}