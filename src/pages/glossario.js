import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { SITE_URL } from '../lib/config';
import { BookOpen, ArrowRight, Sparkles, Scale, TrendingUp } from 'lucide-react';

const TERMOS_GLOSSARIO = [
  {
    termo: "Anexo III (Simples Nacional)",
    tag: "Tributação PJ",
    definicao: "Tabela tributária do Simples Nacional com alíquota inicial reduzida de 6% sobre a receita bruta (até R$ 180 mil/ano). Atividades de tecnologia, desenvolvimento de software e consultoria técnica podem tributar pelo Anexo III desde que cumpram o Fator R de no mínimo 28%.",
    linkRelacionado: {
      url: "/blog/simples-nacional-pj-qual-anexo",
      texto: "Guia completo: Como escolher o Anexo do Simples Nacional"
    }
  },
  {
    termo: "Anexo V (Simples Nacional)",
    tag: "Tributação PJ",
    definicao: "Tabela tributária do Simples Nacional com alíquota inicial de 15,5% sobre o faturamento. É o enquadramento aplicado a profissionais intelectuais, de TI ou engenharia caso a folha de salários e pró-labore represente menos de 28% do faturamento dos últimos 12 meses (Fator R insuficiente).",
    linkRelacionado: {
      url: "/blog/simples-nacional-pj-qual-anexo",
      texto: "Entenda as diferenças entre Anexo III e Anexo V"
    }
  },
  {
    termo: "Break-Even (Ponto de Equilíbrio)",
    tag: "Decisão Financeira",
    definicao: "O faturamento bruto mensal mínimo que um profissional PJ deve negociar para que o seu rendimento líquido — após pagar DAS, pró-labore, INSS, IRPF e contador — empate matematicamente com todo o pacote CLT (salário líquido + FGTS + 13º + férias + benefícios). Em média, varia entre 1,35× e 1,65× do salário CLT.",
    linkRelacionado: {
      url: "/blog/comparativos",
      texto: "Consulte o Ponto de Equilíbrio em 26 profissões reais"
    }
  },
  {
    termo: "CNAE",
    tag: "Estrutura Societária",
    definicao: "Classificação Nacional de Atividades Econômicas. Código oficial definido pelo IBGE que descreve exatamente os serviços que o seu CNPJ está autorizado a prestar. O CNAE principal determina a possibilidade de opção pelo Simples Nacional e quais alíquotas de ISS incidirão.",
    linkRelacionado: {
      url: "/blog/como-abrir-cnpj-trabalhar-pj",
      texto: "Passo a passo para escolher o CNAE correto"
    }
  },
  {
    termo: "DAS (Documento de Arrecadação do Simples)",
    tag: "Tributação PJ",
    definicao: "Guia única de recolhimento tributário mensal emitida pelas micro e pequenas empresas optantes pelo Simples Nacional. O DAS consolida tributos federais e municipais (IRPJ, CSLL, PIS, COFINS e ISS) em um único boleto pago até o dia 20 de cada mês.",
    linkRelacionado: {
      url: "/metodologia",
      texto: "Fórmula de cálculo da alíquota efetiva do DAS"
    }
  },
  {
    termo: "Fator R",
    tag: "Economia Tributária",
    definicao: "Fórmula matemática criada pela Lei Complementar 123/2006 que calcula a razão entre a folha de pagamento acumulada dos últimos 12 meses (salários, pró-labore, encargos) e a receita bruta acumulada no mesmo período (RBT12). Se o resultado for igual ou superior a 0,28 (28%), a empresa tem direito a migrar do Anexo V (15,5%) para o Anexo III (6%).",
    linkRelacionado: {
      url: "/blog/simples-nacional-pj-qual-anexo",
      texto: "Simulador de Fator R e cálculo de folha ideal"
    }
  },
  {
    termo: "FGTS (Fundo de Garantia)",
    tag: "Direito Trabalhista CLT",
    definicao: "Depósito compulsório mensal correspondente a 8% do salário bruto do empregado CLT, custeado integralmente pelo empregador. Em caso de demissão sem justa causa, o trabalhador saca o saldo total acumulado corrigido monetariamente acrescido de multa rescisória de 40%.",
    linkRelacionado: {
      url: "/metodologia",
      texto: "Como o FGTS é provisionado nas simulações da calculadora"
    }
  },
  {
    termo: "Lei 15.270/2025",
    tag: "Legislação & IRPF",
    definicao: "Legislação federal que ampliou a faixa de isenção e instituiu novos redutores do Imposto de Renda Pessoa Física no Brasil. Aumentou o poder de compra e o salário líquido de diversas faixas salariais da CLT e redefiniu os pontos de equivalência competitiva entre contratos de trabalho formal e prestação de serviço PJ.",
    linkRelacionado: {
      url: "/blog/vale-pena-pj-isencao-ir-lei-15270-2026",
      texto: "Guia analítico da Lei 15.270/2025 e seus impactos"
    }
  },
  {
    termo: "Lucro Presumido",
    tag: "Regime Tributário",
    definicao: "Regime de tributação federal em que a Receita Federal presume que uma fatia fixa do faturamento (geralmente 32% para serviços intelectuais) constitui o lucro da empresa, sobre a qual incidem IRPJ e CSLL, além de PIS/COFINS (3,65% cumulativo) e ISS municipal (2% a 5%). É frequentemente mais vantajoso que o Simples para empresas que faturam acima de R$ 30.000 a R$ 40.000/mês.",
    linkRelacionado: {
      url: "/metodologia",
      texto: "Entenda o cálculo de IRPJ, CSLL e PIS/COFINS no Lucro Presumido"
    }
  },
  {
    termo: "MEI (Microempreendedor Individual)",
    tag: "Tributação PJ",
    definicao: "Enquadramento simplificado com taxa mensal fixa (DAS-MEI). Possui limite máximo de faturamento de R$ 81.000 ao ano (~R$ 6.750/mês) e restrições rigorosas de atividades: a maioria das profissões intelectuais, de TI, engenharia e saúde é expressamente proibida de abrir MEI pelo Comitê Gestor.",
    linkRelacionado: {
      url: "/blog/como-abrir-cnpj-trabalhar-pj",
      texto: "Por que desenvolvedores e consultores não podem ser MEI"
    }
  },
  {
    termo: "Pró-Labore",
    tag: "Remuneração dos Sócios",
    definicao: "Remuneração obrigatória paga aos sócios que efetivamente exercem trabalho na empresa. Sobre o pró-labore incide retenção de 11% de INSS (garantindo tempo de contribuição e benefícios previdenciários à pessoa física) e IRPF de acordo com a tabela progressiva. O restante do faturamento pode ser distribuído como lucros isentos de impostos.",
    linkRelacionado: {
      url: "/metodologia",
      texto: "Regras de pró-labore mínimo e tributação previdenciária"
    }
  },
  {
    termo: "RBT12",
    tag: "Tributação PJ",
    definicao: "Receita Bruta Total acumulada nos 12 meses anteriores ao período de apuração. É o parâmetro fundamental utilizado pelo Simples Nacional para determinar a faixa de alíquota nominal e a parcela a deduzir no cálculo do DAS mensal.",
    linkRelacionado: {
      url: "/metodologia",
      texto: "Como o RBT12 influencia sua alíquota efetiva"
    }
  }
];

export default function Glossario() {
  const pageUrl = `${SITE_URL}/glossario`;
  const pageTitle = "Glossário Tributário CLT vs PJ | Termos Fiscais e Trabalhistas Explicados";
  const pageDescription = "Dicionário completo e descomplicado de termos fiscais, tributários e trabalhistas para profissionais: Fator R, Simples Nacional, Anexo III, Pró-Labore, IRPF e CLT.";

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
          {/* Hero */}
          <section className="border-b border-rule py-16 md:py-20 relative">
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-grid-pattern" />
            <div className="max-w-4xl mx-auto px-6 md:px-8 relative">
              <div className="eyebrow mb-6">
                <span className="eyebrow-dot" />
                <span>Dicionário Prático de Tributação e Carreira</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-ink font-bold leading-tight mb-6">
                Glossário Fiscal <em className="italic text-money">CLT vs PJ</em>
              </h1>

              <p className="text-lg md:text-xl text-ink-muted leading-relaxed font-sans max-w-2xl">
                O vocabulário tributário e trabalhista brasileiro sem juridiquês. Entenda exatamente o que significa cada termo que impacta seu bolso no final do mês.
              </p>
            </div>
          </section>

          {/* Lista de Termos */}
          <section className="py-16 md:py-20">
            <div className="max-w-4xl mx-auto px-6 md:px-8 font-sans">
              
              <div className="space-y-6">
                {TERMOS_GLOSSARIO.map((item) => (
                  <article 
                    key={item.termo}
                    className="bg-white border border-rule rounded-xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <h2 className="font-display text-2xl font-bold text-ink">
                        {item.termo}
                      </h2>
                      <span className="inline-block font-mono text-[11px] uppercase tracking-wider text-money font-bold bg-money/10 px-2.5 py-1 rounded w-fit">
                        {item.tag}
                      </span>
                    </div>

                    <p className="text-ink-muted text-base leading-relaxed mb-4">
                      {item.definicao}
                    </p>

                    {item.linkRelacionado && (
                      <div className="pt-3 border-t border-rule/50">
                        <Link 
                          href={item.linkRelacionado.url}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-money hover:underline group"
                        >
                          <span>{item.linkRelacionado.texto}</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </div>
                    )}
                  </article>
                ))}
              </div>

              {/* Box de Apoio / Dúvida */}
              <div className="mt-16 bg-paper border border-rule rounded-2xl p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <h3 className="font-display text-xl font-bold text-ink mb-1">
                    Não encontrou o que procurava?
                  </h3>
                  <p className="text-sm text-ink-muted">
                    Veja nossa metodologia detalhada com todas as fórmulas matemáticas ou envie uma sugestão.
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <Link 
                    href="/metodologia"
                    className="btn-primary text-xs font-bold px-4 py-2.5 rounded-lg"
                  >
                    Ver Metodologia
                  </Link>
                  <Link 
                    href="/contato"
                    className="btn-secondary text-xs font-bold px-4 py-2.5 rounded-lg"
                  >
                    Fale Conosco
                  </Link>
                </div>
              </div>

            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}

