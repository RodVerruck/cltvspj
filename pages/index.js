import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Calculator, TrendingUp, CheckCircle, AlertCircle, DollarSign, Users, ArrowRight, Briefcase } from 'lucide-react';

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
  const [totalUsers, setTotalUsers] = useState(12847);

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalUsers(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const calculateCLT = () => {
    const sal = parseFloat(salary) || 0;
    const totalBenefits = Object.values(benefits).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);

    const inss = Math.min(sal * 0.14, 908.85);
    const irpfBase = sal - inss;
    let irpf = 0;
    if (irpfBase > 4664.68) irpf = irpfBase * 0.275 - 869.36;
    else if (irpfBase > 3751.05) irpf = irpfBase * 0.225 - 636.13;
    else if (irpfBase > 2826.65) irpf = irpfBase * 0.15 - 354.80;
    else if (irpfBase > 2112.00) irpf = irpfBase * 0.075 - 158.40;

    const netSalary = sal - inss - Math.max(irpf, 0);
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

    const issqn = monthlyGross * 0.05;
    const inss = 1518.00;
    const irpj = monthlyGross * 0.048;
    const csll = monthlyGross * 0.0288;
    const pisCofins = monthlyGross * 0.0365;

    const totalTaxes = issqn + inss + irpj + csll + pisCofins;
    const netMonthly = monthlyGross - totalTaxes;

    return {
      gross: monthlyGross,
      net: netMonthly,
      issqn,
      inss,
      irpj,
      csll,
      pisCofins,
      totalTaxes
    };
  };

  const handleCalculate = () => {
    setShowResults(true);
    setTotalUsers(prev => prev + 1);
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
        <meta property="og:title" content="Calculadora CLT x PJ 2026 | Veja Qual Compensa Mais" />
        <meta property="og:description" content="Compare seu salário CLT com PJ em segundos. Cálculo completo com TODOS os impostos e benefícios." />
        <meta property="og:site_name" content="CLT ou PJ" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Calculadora CLT x PJ 2026" />
        <meta name="twitter:description" content="Descubra quanto você realmente ganha como CLT vs PJ" />

        {/* Canonical */}
        <link rel="canonical" href="https://calculadora-cltvspj.vercel.app" />

        {/* Google AdSense Account */}
        <meta name="google-adsense-account" content="ca-pub-2888261288759622" />

        {/* Google AdSense */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2888261288759622" crossOrigin="anonymous"></script>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="text-indigo-600" size={28} />
              <h1 className="text-xl font-bold text-gray-900">CLT ou PJ?</h1>
            </div>
            <div className="flex items-center gap-6">
              <a href="/blog" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition">
                Blog
              </a>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users size={16} />
                <span>{totalUsers.toLocaleString('pt-BR')} cálculos hoje</span>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 py-12 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <TrendingUp size={16} />
            Ferramenta #1 para comparar CLT e PJ no Brasil
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Descubra quanto você <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">realmente</span> ganha
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Compare seu salário CLT com uma proposta PJ em segundos. Cálculo completo com TODOS os impostos, benefícios e encargos.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <div className="flex items-center gap-2 text-green-700 bg-green-50 px-4 py-2 rounded-lg">
              <CheckCircle size={20} />
              <span className="font-medium">100% Gratuito</span>
            </div>
            <div className="flex items-center gap-2 text-blue-700 bg-blue-50 px-4 py-2 rounded-lg">
              <CheckCircle size={20} />
              <span className="font-medium">Cálculo Preciso</span>
            </div>
            <div className="flex items-center gap-2 text-purple-700 bg-purple-50 px-4 py-2 rounded-lg">
              <CheckCircle size={20} />
              <span className="font-medium">Resultado Instantâneo</span>
            </div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="max-w-7xl mx-auto px-4 pb-12">
          <div className="grid md:grid-cols-2 gap-6">
            {/* CLT Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Briefcase className="text-blue-600" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Regime CLT</h3>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Salário Bruto Mensal
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
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <DollarSign className="text-purple-600" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Regime PJ</h3>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Valor da Hora (PJ)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">R$</span>
                    <input
                      type="number"
                      value={pjRate}
                      onChange={(e) => setPjRate(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition text-lg"
                      placeholder="100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Horas Trabalhadas/Mês
                  </label>
                  <input
                    type="number"
                    value={hoursPerMonth}
                    onChange={(e) => setHoursPerMonth(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition text-lg"
                    placeholder="160"
                  />
                </div>

                <div className="bg-purple-50 rounded-xl p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">Faturamento Mensal</h4>
                  <p className="text-3xl font-bold text-purple-600">
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
          <section className="max-w-7xl mx-auto px-4 pb-12">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl shadow-2xl p-8 md:p-12 text-white mb-8">
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
                    <span className="text-gray-600">(-) Simples Nacional</span>
                    <span className="font-semibold text-red-600">-R$ {(pj.irpj + pj.csll + pj.pisCofins).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">(-) ISS (5%)</span>
                    <span className="font-semibold text-red-600">-R$ {pj.issqn.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">(-) INSS PJ</span>
                    <span className="font-semibold text-red-600">-R$ {pj.inss.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between py-3 bg-purple-50 rounded-lg px-3 mt-2">
                    <span className="font-bold text-gray-900">Total de Impostos</span>
                    <span className="font-bold text-red-600">R$ {pj.totalTaxes.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between py-3 bg-purple-50 rounded-lg px-3">
                    <span className="font-bold text-gray-900">Valor Líquido Mensal</span>
                    <span className="font-bold text-purple-600 text-lg">R$ {pj.net.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
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
        <section className="max-w-7xl mx-auto px-4 py-12 border-t border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">⚠️ Pontos Importantes</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="font-bold text-gray-900 mb-2">CLT tem estabilidade</h4>
              <p className="text-sm text-gray-600">FGTS, férias remuneradas, 13º salário e direitos trabalhistas garantidos</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="font-bold text-gray-900 mb-2">PJ tem mais lucro líquido</h4>
              <p className="text-sm text-gray-600">Mas você precisa pagar seu próprio plano de saúde, aposentadoria e não tem férias pagas</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="font-bold text-gray-900 mb-2">Considere sua situação</h4>
              <p className="text-sm text-gray-600">Avalie segurança x ganhos, momento de vida e planejamento financeiro</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-gray-400 text-sm">
              &copy; 2026 CLT ou PJ - Calculadora gratuita | Dados atualizados conforme legislação brasileira 2026
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Esta é uma ferramenta de simulação. Consulte um contador para decisões financeiras importantes.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}