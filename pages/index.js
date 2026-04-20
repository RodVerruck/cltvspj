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
        <section className="max-w-5xl mx-auto px-4 py-12 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-500 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <TrendingUp size={16} />
            Ferramenta #1 para comparar CLT e PJ no Brasil
          </div>

          <h2 className="font-serif text-4xl md:text-5xl font-normal text-gray-900 mb-4 tracking-tight">
            Descubra quanto você <span className="text-brand-500">realmente</span> ganha
          </h2>

          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8 leading-relaxed">
            Compare seu salário CLT com uma proposta PJ em segundos. Cálculo completo com TODOS os impostos, benefícios e encargos.
          </p>

          <div className="flex flex-wrap gap-3 justify-center mb-12">
            <div className="flex items-center gap-2 text-green-700 bg-green-50 px-4 py-2 rounded-lg text-sm">
              <CheckCircle size={16} />
              <span className="font-medium">100% Gratuito</span>
            </div>
            <div className="flex items-center gap-2 text-brand-500 bg-brand-50 px-4 py-2 rounded-lg text-sm">
              <CheckCircle size={16} />
              <span className="font-medium">Cálculo Preciso</span>
            </div>
            <div className="flex items-center gap-2 text-brand-500 bg-brand-50 px-4 py-2 rounded-lg text-sm">
              <CheckCircle size={16} />
              <span className="font-medium">Resultado Instantâneo</span>
            </div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="max-w-5xl mx-auto px-4 pb-12">
          <div className="grid md:grid-cols-2 gap-6">
            {/* CLT Form */}
            <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-brand-50 rounded-xl">
                  <Briefcase className="text-brand-500" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Regime CLT</h3>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Salário Bruto Mensal
                    <div className="group relative">
                      <Info size={14} className="text-gray-400 cursor-help" />
                      <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                        Valor do salário antes dos descontos de INSS e IRPF
                      </div>
                    </div>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">R$</span>
                    <input
                      type="number"
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition text-lg"
                      placeholder="8000"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-5">
                  <h4 className="font-semibold text-gray-900 mb-4">Benefícios Mensais</h4>
                  <div className="space-y-3">
                    {[
                      { key: 'vr', label: 'Vale Refeição' },
                      { key: 'vt', label: 'Vale Transporte' },
                      { key: 'planoSaude', label: 'Plano de Saúde' },
                      { key: 'seguroVida', label: 'Seguro de Vida' }
                    ].map(({ key, label }) => (
                      <div key={key}>
                        <label className="block text-sm text-gray-600 mb-1">{label}</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">R$</span>
                          <input
                            type="number"
                            value={benefits[key]}
                            onChange={(e) => setBenefits({ ...benefits, [key]: e.target.value })}
                            className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* PJ Form */}
            <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-accent-50 rounded-xl">
                  <DollarSign className="text-accent-400" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Regime PJ</h3>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Valor da Hora (PJ)
                    <div className="group relative">
                      <Info size={14} className="text-gray-400 cursor-help" />
                      <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                        Quanto você cobra por hora de trabalho como PJ
                      </div>
                    </div>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">R$</span>
                    <input
                      type="number"
                      value={pjRate}
                      onChange={(e) => setPjRate(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-400 focus:outline-none transition text-lg"
                      placeholder="100"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Horas Trabalhadas/Mês
                    <div className="group relative">
                      <Info size={14} className="text-gray-400 cursor-help" />
                      <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                        Total de horas que você trabalha por mês (geralmente 160h = 8h/dia × 20 dias)
                      </div>
                    </div>
                  </label>
                  <input
                    type="number"
                    value={hoursPerMonth}
                    onChange={(e) => setHoursPerMonth(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-400 focus:outline-none transition text-lg"
                    placeholder="160"
                  />
                </div>

                <div className="bg-accent-50 rounded-xl p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">Faturamento Mensal</h4>
                  <p className="text-3xl font-bold text-accent-400">
                    R$ {((parseFloat(pjRate) || 0) * (parseFloat(hoursPerMonth) || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex gap-2">
                    <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="text-sm text-amber-900 font-medium">Simples Nacional</p>
                      <p className="text-xs text-amber-700 mt-1">Cálculo baseado no Anexo III (Alíquota 6%)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Calculate Button */}
          <div className="text-center mt-8">
            <button
              onClick={handleCalculate}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white px-12 py-4 rounded-xl font-bold text-lg shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transform hover:scale-105 transition"
            >
              <Calculator size={24} />
              Calcular Agora
              <ArrowRight size={20} />
            </button>
          </div>
        </section>

        {/* Results Section */}
        {showResults && (
          <section className="max-w-5xl mx-auto px-4 pb-12">
            <div className="bg-brand-500 rounded-2xl shadow-lg p-8 md:p-12 text-white mb-8">
              <h3 className="text-3xl font-bold mb-6 text-center"> Seu Resultado</h3>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <p className="text-white/80 text-sm font-medium mb-2">CLT Líquido + Benefícios</p>
                  <p className="text-3xl font-bold">R$ {clt.net.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>

                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <p className="text-white/80 text-sm font-medium mb-2">PJ Líquido Mensal</p>
                  <p className="text-3xl font-bold">R$ {pj.net.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>

                <div className={`backdrop-blur-lg rounded-2xl p-6 border ${difference >= 0 ? 'bg-green-500/20 border-green-300/30' : 'bg-red-500/20 border-red-300/30'}`}>
                  <p className="text-white/80 text-sm font-medium mb-2">Diferença</p>
                  <p className="text-3xl font-bold">
                    {difference >= 0 ? '+' : ''}R$ {Math.abs(difference).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm mt-1">({percentDiff}%)</p>
                </div>
              </div>

              <div className={`text-center p-6 rounded-2xl ${difference >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                <p className="text-2xl font-bold mb-2">
                  {difference >= 0
                    ? ' Como PJ você ganha MAIS!'
                    : ' CLT é mais vantajoso neste caso'}
                </p>
                <p className="text-white/90">
                  {difference >= 0
                    ? `Você teria R$ ${Math.abs(difference).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} a mais por mês como PJ`
                    : `Você perderia R$ ${Math.abs(difference).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} por mês como PJ`}
                </p>
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h4 className="text-xl font-bold text-gray-900 mb-4">Detalhamento CLT</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Salário Bruto</span>
                    <span className="font-semibold">R$ {clt.gross.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">(-) INSS</span>
                    <span className="font-semibold text-red-600">-R$ {clt.inss.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">(-) IRPF</span>
                    <span className="font-semibold text-red-600">-R$ {clt.irpf.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">(+) Benefícios</span>
                    <span className="font-semibold text-green-600">+R$ {clt.benefits.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">FGTS (8%)</span>
                    <span className="font-semibold text-blue-600">R$ {clt.fgts.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">13º Salário (mensal)</span>
                    <span className="font-semibold text-blue-600">R$ {clt.decimoTerceiro.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Férias (mensal)</span>
                    <span className="font-semibold text-blue-600">R$ {clt.ferias.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between py-3 bg-blue-50 rounded-lg px-3 mt-2">
                    <span className="font-bold text-gray-900">Valor Líquido Total</span>
                    <span className="font-bold text-blue-600 text-lg">R$ {clt.net.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h4 className="text-xl font-bold text-gray-900 mb-4">Detalhamento PJ</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Faturamento Bruto</span>
                    <span className="font-semibold">R$ {pj.gross.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">(-) DAS Simples Nacional (6%)</span>
                    <span className="font-semibold text-red-600">-R$ {pj.simplesDAS.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">(-) INSS Pró-labore (11%)</span>
                    <span className="font-semibold text-red-600">-R$ {pj.inssProLabore.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between py-3 bg-accent-50 rounded-lg px-3 mt-2">
                    <span className="font-bold text-gray-900">Total de Impostos</span>
                    <span className="font-bold text-red-600">R$ {pj.totalTaxes.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between py-3 bg-accent-50 rounded-lg px-3">
                    <span className="font-bold text-gray-900">Valor Líquido Mensal</span>
                    <span className="font-bold text-accent-400 text-lg">R$ {pj.net.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-12 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4"> Quer abrir sua PJ com desconto?</h3>
              <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                Parceiros exclusivos com condições especiais para quem usa nossa calculadora
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <a href="#" className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-lg">
                  Abrir Conta PJ com Cashback
                </a>
                <a href="#" className="bg-white text-gray-900 border-2 border-gray-300 px-8 py-3 rounded-xl font-bold hover:bg-gray-50 transition">
                  Falar com Contador
                </a>
              </div>
            </div>
          </section>
        )}

        {/* Info Section */}
        <section className="max-w-5xl mx-auto px-4 py-12 border-t border-gray-200">
          <h3 className="font-serif text-2xl font-normal text-gray-900 mb-6 text-center">Pontos Importantes</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">CLT tem estabilidade</h4>
              <p className="text-sm text-gray-500 leading-relaxed">FGTS, férias remuneradas, 13º salário e direitos trabalhistas garantidos</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">PJ tem mais lucro líquido</h4>
              <p className="text-sm text-gray-500 leading-relaxed">Mas você precisa pagar seu próprio plano de saúde, aposentadoria e não tem férias pagas</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">Considere sua situação</h4>
              <p className="text-sm text-gray-500 leading-relaxed">Avalie segurança x ganhos, momento de vida e planejamento financeiro</p>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}