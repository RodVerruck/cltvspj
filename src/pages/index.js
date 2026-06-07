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

  // Novos estados para a evolução tributária
  const [dependentes, setDependentes] = useState('0');
  const [pensaoAlimenticia, setPensaoAlimenticia] = useState('');
  const [plrAnual, setPlrAnual] = useState('');
  const [proLaboreInput, setProLaboreInput] = useState('minimo');
  const [proLaboreCustom, setProLaboreCustom] = useState('');
  const [folha12Meses, setFolha12Meses] = useState('');
  const [issRate, setIssRate] = useState('3');
  const [mensalidadeContador, setMensalidadeContador] = useState('');

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

            {/* Painel de Dados Pessoais (Deduções IRPF) */}
            <div className="bg-white border border-rule rounded-md p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 relative shadow-sm">
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-money -translate-x-px -translate-y-px"></div>
              <div>
                <h3 className="font-display text-xl text-ink mb-1 flex items-center gap-1.5 font-bold">
                  Deduções de Imposto de Renda
                  <span className="text-[9px] bg-rule px-1.5 py-0.5 rounded text-ink-fade font-mono uppercase font-bold tracking-wider">Pessoa Física</span>
                </h3>
                <p className="text-xs text-ink-muted leading-relaxed font-sans">
                  Valores deduzidos no cálculo tradicional do IRPF para o salário CLT e para o Pró-labore PJ.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-ink-muted mb-1 block">Dependentes IRPF</label>
                  <select 
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
                  <label className="text-xs text-ink-muted mb-1 block">Pensão Alimentícia Judicial</label>
                  <div className="flex items-baseline gap-1.5 border-b-2 border-rule pb-2 transition-colors focus-within:border-money">
                    <span className="font-mono text-sm text-ink-fade">R$</span>
                    <input 
                      type="text" 
                      value={pensaoAlimenticia} 
                      onChange={(e) => setPensaoAlimenticia(e.target.value)}
                      placeholder="0,00"
                      className="font-mono text-sm text-ink bg-transparent outline-none w-full py-0.5"
                    />
                  </div>
                  <p className="text-[9px] text-ink-fade mt-1 leading-tight font-sans">
                    Apenas pensão homologada judicialmente ou por escritura pública.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-sans">
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
                  <p className="text-[10px] text-ink-fade mt-4 leading-normal font-sans bg-paper p-3 rounded border border-rule">
                    💡 <strong>Nota sobre Benefícios</strong>: Benefícios corporativos pagos pela empresa (como plano de saúde familiar, VR, etc.) entram integralmente isentos de impostos e elevam o valor do seu Pacote Total.
                  </p>
                </div>

                <div className="mt-6 border-t border-rule pt-6">
                  <h4 className="font-display text-lg text-ink mb-4 font-bold">PLR / Bônus Anual</h4>
                  <div>
                    <label className="text-xs text-ink-muted mb-1 block flex items-center gap-1.5">
                      PLR anual (opcional)
                      <span className="text-[9px] bg-rule px-1 py-0.5 rounded text-ink-fade font-mono uppercase font-bold tracking-wider">Tributação Exclusiva</span>
                    </label>
                    <div className="flex items-baseline gap-2 border-b-2 border-rule pb-2 transition-colors focus-within:border-money">
                      <span className="font-mono text-lg text-ink-fade">R$</span>
                      <input
                        type="text"
                        value={plrAnual}
                        onChange={(e) => setPlrAnual(e.target.value)}
                        placeholder="0,00"
                        className="font-mono text-lg text-ink bg-transparent outline-none flex-1 py-1 placeholder:text-ink-fade/40"
                      />
                    </div>
                    <p className="text-[10px] text-ink-fade mt-1.5 leading-normal font-sans">
                      Informe apenas se sua empresa possui programa de PLR.
                    </p>
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

                {/* Mensalidade do Contador */}
                {regime !== 'mei' && (
                  <div className="mb-6 animate-fade-in">
                    <label className="text-sm text-ink-muted mb-2 block flex items-center gap-1.5">
                      Mensalidade do contador (opcional)
                      <span className="text-[10px] bg-rule px-1.5 py-0.5 rounded text-ink-fade font-mono uppercase font-bold tracking-wider">Custo Operacional</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                      {[
                        { value: '', label: 'Não considerar' },
                        { value: '150', label: 'R$ 150' },
                        { value: '250', label: 'R$ 250' },
                        { value: '350', label: 'R$ 350' }
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setMensalidadeContador(opt.value)}
                          className={`py-1.5 px-1 text-[11px] font-medium rounded transition-colors border ${mensalidadeContador === opt.value ? 'bg-ink text-paper border-ink' : 'text-ink-muted border-rule hover:bg-rule/30'}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    {mensalidadeContador !== '' && mensalidadeContador !== '150' && mensalidadeContador !== '250' && mensalidadeContador !== '350' && (
                      <div className="flex items-baseline gap-2 border-b-2 border-rule pb-2 transition-colors focus-within:border-money">
                        <span className="font-mono text-base text-ink-fade">R$</span>
                        <input
                          type="text"
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
                        + Informar valor personalizado
                      </button>
                    )}
                  </div>
                )}

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

                {/* Configuração do Pró-labore */}
                {regime !== 'mei' && (
                  <div className="mb-6">
                    <label className="text-sm text-ink-muted mb-2 block flex items-center gap-1.5">
                      Configuração do Pró-labore
                      <span className="text-ink-fade hover:text-ink cursor-help relative group" title="O pró-labore é o salário do sócio-administrador. Ele deve ser compatível com a atividade exercida.">
                        <Info size={13} className="inline-block" />
                      </span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                      {[
                        { value: 'minimo', label: 'Mínimo (R$ 1.621)' },
                        { value: 'padrao', label: 'Otimizado (Fator R)' },
                        { value: '3000', label: 'R$ 3.000' },
                        { value: '5000', label: 'R$ 5.000' },
                        { value: '8000', label: 'R$ 8.000' },
                        { value: 'personalizado', label: 'Personalizado' }
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setProLaboreInput(opt.value)}
                          className={`py-1.5 px-1.5 text-[11px] font-medium rounded transition-colors border ${proLaboreInput === opt.value ? 'bg-ink text-paper border-ink' : 'text-ink-muted border-rule hover:bg-rule/30'}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    
                    {proLaboreInput === 'personalizado' && (
                      <div className="flex items-baseline gap-2 border-b-2 border-rule pb-2 transition-colors focus-within:border-money animate-fade-in">
                        <span className="font-mono text-lg text-ink-fade">R$</span>
                        <input
                          type="text"
                          value={proLaboreCustom}
                          onChange={(e) => setProLaboreCustom(e.target.value)}
                          placeholder="0,00"
                          className="font-mono text-lg text-ink bg-transparent outline-none flex-1 py-1"
                        />
                        <span className="text-xs text-ink-fade">/mês</span>
                      </div>
                    )}
                    <p className="text-[10px] text-ink-fade mt-1 leading-normal font-sans">
                      ⚠️ <em>Pró-labore deve ser compatível com a atividade exercida.</em>
                    </p>
                  </div>
                )}

                {regime === 'simples' && (
                  <div className="mb-6 animate-fade-in grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-ink-muted mb-2 block flex items-center gap-1.5">
                        Faturamento dos últimos 12 meses (RBT12)
                        <span className="text-[9px] bg-rule px-1 py-0.5 rounded text-ink-fade font-mono uppercase font-bold tracking-wider">Opcional</span>
                      </label>
                      <div className="flex items-baseline gap-2 border-b-2 border-rule pb-2 transition-colors focus-within:border-money">
                        <span className="font-mono text-base text-ink-fade">R$</span>
                        <input
                          type="text"
                          value={faturamento12Meses}
                          onChange={(e) => setFaturamento12Meses(e.target.value)}
                          placeholder="Ex: 180.000,00"
                          className="font-mono text-base text-ink bg-transparent outline-none flex-1 py-0.5 placeholder:text-ink-fade/40"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-ink-muted mb-2 block flex items-center gap-1.5">
                        Folha de pagamento dos últimos 12 meses
                        <span className="text-[9px] bg-rule px-1 py-0.5 rounded text-ink-fade font-mono uppercase font-bold tracking-wider">Opcional</span>
                      </label>
                      <div className="flex items-baseline gap-2 border-b-2 border-rule pb-2 transition-colors focus-within:border-money">
                        <span className="font-mono text-base text-ink-fade">R$</span>
                        <input
                          type="text"
                          value={folha12Meses}
                          onChange={(e) => setFolha12Meses(e.target.value)}
                          placeholder="Ex: 50.400,00"
                          className="font-mono text-base text-ink bg-transparent outline-none flex-1 py-0.5 placeholder:text-ink-fade/40"
                        />
                      </div>
                    </div>

                    <div className="col-span-1 sm:col-span-2">
                      <p className="text-[11px] text-ink-fade leading-relaxed font-sans bg-paper p-3 rounded border border-rule flex items-start gap-1.5">
                        <span>ℹ️</span>
                        <span><strong>Fórmula</strong>: Fator R = Folha dos últimos 12 meses ÷ Faturamento dos últimos 12 meses (RBT12).</span>
                      </p>

                      {!folha12Meses && (
                        <p className="text-[11px] text-[#856404] leading-relaxed font-sans bg-[#fff3cd] p-3 rounded border border-[#ffeeba] mt-3 flex items-start gap-1.5 animate-fade-in">
                          <span>⚠️</span>
                          <span>O Fator R está sendo estimado. Informe a folha de pagamento dos últimos 12 meses para maior precisão.</span>
                        </p>
                      )}
                    </div>

                    {/* Indicador Visual do Fator R no formulário */}
                    <div className="col-span-1 sm:col-span-2 border border-rule/60 rounded p-4 bg-paper/30 mt-2">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-ink-muted">Potencial de otimização tributária</span>
                        <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded text-white ${pj.anexo === 'III' ? 'bg-money' : 'bg-hot'}`}>
                          {pj.anexo === 'III' ? 'Anexo III (Tributação menor)' : 'Anexo V (Tributação maior)'}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-sm font-semibold text-ink">Fator R Atual: {pj.fatorRPercent.toFixed(2).replace('.', ',')}% {pj.isFatorREstimado ? '(Estimado)' : ''}</span>
                        <span className="text-xs text-ink-fade">Meta: 28%</span>
                      </div>
                      <div className="w-full bg-rule/35 h-3 rounded-full overflow-hidden relative mb-2">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${pj.anexo === 'III' ? 'bg-money' : 'bg-hot'}`}
                          style={{ width: `${Math.min(100, (pj.fatorRPercent / 28) * 100)}%` }}
                        ></div>
                        <div className="absolute top-0 bottom-0 left-[100%] w-0.5 bg-ink/30" style={{ left: '28%' }}></div>
                      </div>
                      <p className="text-[11px] text-ink-muted font-sans leading-normal">
                        {pj.anexo === 'III' ? (
                          <span className="text-money font-medium">✓ Enquadrado no Anexo III. Sua folha atende à exigência mínima da Receita Federal.</span>
                        ) : (
                          <span className="text-hot font-medium">
                            ⚠️ Abaixo dos 28%. Faltam {(28 - pj.fatorRPercent).toFixed(2).replace('.', ',')} pontos percentuais (ou R$ {Math.max(0, (pj.rbt12Utilizado * 0.28) - pj.folhaUtilizada).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}/ano em folha) para migrar ao Anexo III.
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {regime === 'presumido' && (
                  <div className="mb-6 animate-fade-in">
                    <label className="text-sm text-ink-muted mb-2 block flex items-center gap-1.5">
                      ISS do município (Alíquota)
                      <span className="text-[10px] bg-rule/50 px-1.5 py-0.5 rounded text-ink-fade font-mono uppercase font-bold tracking-wider">Municipal</span>
                    </label>
                    <div className="flex border border-rule rounded overflow-hidden">
                      {['2', '3', '4', '5'].map((rate) => (
                        <button
                          key={rate}
                          type="button"
                          onClick={() => setIssRate(rate)}
                          className={`flex-1 py-2 text-sm font-medium transition-colors border-r border-rule last:border-r-0 ${issRate === rate ? 'bg-ink text-paper' : 'text-ink-muted hover:bg-rule/30'}`}
                        >
                          {rate}%
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-ink-fade mt-1.5 leading-normal font-sans">
                      A alíquota de ISS varia de 2% a 5% conforme a cidade. <strong>Consulte seu contador ou prefeitura.</strong>
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
                      <p className="text-xs text-hot/80 mt-1 leading-relaxed">
                        {regime === 'simples' ? (
                          <>
                            Simulação voltada para atividades de serviços sujeitas ao Fator R. 
                            Pró-labore/Folha de pagamento ≥ 28% do faturamento enquadra no <strong>Anexo III (inicia em 6%)</strong>, caso contrário cai no <strong>Anexo V (inicia em 15,5%)</strong>.
                          </>
                        ) : regime === 'presumido' ? (
                          <>
                            Tributação federal de 11,33% (IRPJ+CSLL+PIS+COFINS) + ISS do município. 
                            <strong> Nota</strong>: Estimativa baseada em empresa sem funcionários (não inclui RAT, Terceiros/Sistema S e INSS patronal sobre salários).
                          </>
                        ) : (
                          'Teto anual: R$ 81.000 (DAS R$ 86,05).'
                        )}
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
                      O faturamento simulado de <strong className="text-ink">R$ {((parseFloat(pjRate) || 0) * (parseFloat(hoursPerMonth) || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}/mês</strong> (ou faturamento anual informado) ultrapassa o limite de <strong className="text-ink">R$ 81.000,00</strong> anuais permitido para o MEI em 2026 (verificação simplificada baseada no teto anual). 
                      Para que sua comparação seja realista e legal, recalculamos os impostos e o valor líquido abaixo automaticamente com base nas regras do <strong className="text-ink">Simples Nacional Anexo III (Fator R)</strong>.
                    </p>
                  </div>
                </div>
              )}

              {/* Passo 1: HERO RESULT CARD */}
              <div className={`border rounded-xl p-8 md:p-10 mb-8 relative overflow-hidden transition-colors duration-500 shadow-sm ${
                pj.net > clt.totalPackage 
                  ? 'bg-money-light border-money/20' 
                  : 'bg-hot-light border-hot/20'
              }`}>
                <div className={`absolute top-0 left-0 w-2 h-full ${pj.net > clt.totalPackage ? 'bg-money' : 'bg-hot'}`}></div>
                
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2.5">
                      <span className="font-mono text-xs uppercase tracking-widest text-ink-muted">Recomendação</span>
                      <span className={`text-[10px] font-semibold font-mono uppercase tracking-wider px-2 py-0.5 rounded border flex items-center gap-1.5 shadow-sm ${impactoGeralCor}`}>
                        <span>{impactoBolinha}</span>
                        <span>{impactoGeralLabel}</span>
                      </span>
                    </div>
                    <h3 className="font-display text-3xl md:text-4xl text-ink font-bold leading-tight mb-3">
                      {pj.net > clt.totalPackage ? (
                        <>A opção <span className="text-money italic font-bold">PJ</span> é mais vantajosa para você.</>
                      ) : (
                        <>A opção <span className="text-hot italic font-bold">CLT</span> é mais vantajosa para você.</>
                      )}
                    </h3>
                    <p className="text-sm text-ink-muted max-w-xl font-sans leading-relaxed">
                      Desenvolvido com base nas regras tributárias vigentes e destinado a fins de simulação e apoio à tomada de decisão.
                    </p>
                    <p className="text-[11px] text-ink-fade font-mono mt-3 pt-3 border-t border-rule/30">
                      Comparação baseada em: CLT R$ {clt.gross.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/mês (salário bruto) vs PJ R$ {pj.gross.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/mês (faturamento bruto).
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

              {/* ALERTA DE COMPARAÇÃO DESPROPORCIONAL */}
              {showAlertaDiscrepancia && (
                <div className="bg-[#fff3cd] border border-[#ffeeba] rounded-xl p-5 mb-8 flex gap-4 items-start relative animate-fade-in overflow-hidden shadow-sm text-left">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#ffc107]"></div>
                  <AlertCircle className="text-[#856404] flex-shrink-0 mt-0.5" size={22} />
                  <div>
                    <h4 className="font-display text-lg text-ink font-bold mb-1 text-[#856404]">Alerta de Comparação Desproporcional</h4>
                    <p className="text-xs text-ink-muted leading-relaxed font-sans">
                      Você está comparando um salário CLT de <strong className="text-ink">R$ {clt.gross.toLocaleString('pt-BR')}/mês</strong> com um faturamento PJ de <strong className="text-ink">R$ {pj.gross.toLocaleString('pt-BR')}/mês</strong>. 
                      Como os valores brutos informados diferem significativamente (relação de {(pj.gross / (clt.gross || 1)).toFixed(2).replace('.', ',')}x), parte da diferença financeira mostrada no resultado decorre da assimetria dos valores brutos simulados, e não exclusivamente da diferença de regimes tributários.
                    </p>
                  </div>
                </div>
              )}

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
                    
                    <div className="mt-2 text-[10px] text-ink-fade leading-normal font-sans border-t border-rule/30 pt-1.5">
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
                          <span className="font-mono text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border bg-paper-dark text-ink-muted border-rule/80">
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
                            <span className={`ml-auto text-[9px] font-mono uppercase font-bold px-1.5 py-0.5 rounded border flex items-center gap-1 ${
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
                          <p className="text-[10px] text-green-600/80 mt-1 leading-normal">
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
                          <p className="text-[10px] text-red-600/80 mt-1 leading-normal">
                            A economia de DAS do Anexo III não cobre o aumento de impostos pessoais (INSS e IRPF) do pró-labore. Melhor permanecer no Anexo V.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-[10px] text-ink-fade leading-relaxed font-sans italic">
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
                      <span className="text-ink-fade uppercase tracking-wider text-[10px]">CLT (INSS Anual)</span>
                      <span className="font-bold text-ink font-mono">R$ {clt.inssAnualCLT.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}/ano</span>
                    </div>

                    <div className="bg-paper/30 border border-rule/50 rounded-lg p-3 flex justify-between items-center">
                      <span className="text-ink-fade uppercase tracking-wider text-[10px]">PJ (INSS Pró-labore Anual)</span>
                      <span className="font-bold text-ink font-mono">R$ {pj.inssAnualPJ.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}/ano</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-ink-fade leading-relaxed bg-paper p-3.5 rounded border border-rule">
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
                        <span className="text-[10px] text-ink-fade leading-tight block font-sans max-w-[260px] mt-0.5">
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
                    <span className="absolute top-0 right-0 bg-[#f5f1e8] text-[#0c4a3e] font-mono text-[9px] uppercase font-bold tracking-widest px-3 py-1 rounded-bl-lg shadow-sm">
                      Recomendado
                    </span>
                  )}
                  
                  <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between font-sans relative z-10">
                    <div className="max-w-xl">
                      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#f5f1e8]/50 block mb-2 font-bold">
                        Parceiro Contábil Recomendado
                      </span>
                      <p className={`leading-relaxed text-[#f5f1e8] ${pj.contabilidadeMetadata.oportunidadeScore >= 8 ? 'text-base font-semibold' : 'text-sm'}`}>
                        {pj.contabilidadeMetadata.ctaCaso === 'equilibrio' 
                          ? `A diferença encontrada foi de apenas R$ ${Math.abs(pj.net - clt.totalPackage).toLocaleString('pt-BR', { maximumFractionDigits: 0 })} por mês. Nessa situação, benefícios CLT, aposentadoria, estabilidade e estratégia empresarial podem ser tão relevantes quanto os impostos. Recomendamos falar com a equipe da Manassés.`
                          : pj.contabilidadeMetadata.ctaTexto}
                      </p>
                      <p className="text-[11px] text-[#f5f1e8]/75 mt-2">
                        Assessoria especializada no Fator R para profissionais de TI e suporte dedicado via WhatsApp. <strong>Ganha 50% de desconto na primeira mensalidade!</strong>
                      </p>
                    </div>
                    
                    <div className="flex-shrink-0 font-sans">
                      <a
                        href="/go/manasses"
                        rel="sponsored nofollow"
                        className="group inline-flex items-center gap-2 rounded transition-all duration-300 font-bold whitespace-nowrap shadow-sm hover:shadow-md bg-[#f5f1e8] text-[#0c4a3e] hover:bg-white hover:scale-[1.02] px-6 py-4 text-base"
                      >
                        Falar com contador
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Passo 10: LIMITAÇÕES DA SIMULAÇÃO (RODAPÉ DISCRETO) */}
              <div className="mt-8 pt-5 border-t border-rule/30 text-center font-sans">
                <p className="text-[10px] text-ink-fade leading-relaxed max-w-2xl mx-auto">
                  *Esta ferramenta é um simulador simplificado com finalidade exclusivamente informativa e de apoio à tomada de decisão. As estimativas tributárias não constituem orientação contábil formal ou aconselhamento jurídico e devem ser validadas individualmente com um profissional qualificado antes de qualquer enquadramento societário ou tributário.
                </p>
              </div>

            </div>
          </section>
          )}

        <Footer />
      </div >
    </>
  )
}