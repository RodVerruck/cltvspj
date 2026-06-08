import { formatBRL, formatBRLShort } from './format';

function getIncomeTier(cltGross) {
  if (cltGross < 5000) return 'entry';
  if (cltGross < 10000) return 'mid';
  if (cltGross < 20000) return 'high';
  return 'premium';
}

/**
 * Conteúdo editorial único por faixa — evita páginas finas só com números trocados.
 */
export function getRichComparativoContent(params) {
  const {
    cltGross,
    pjMonthlyGross,
    pjRate,
    hoursPerMonth,
    clt,
    pj,
    winner,
    diffMonthly,
    diffAnnual,
    type,
    role,
  } = params;

  const tier = getIncomeTier(cltGross);
  const cltLabel = formatBRLShort(cltGross);
  const pjLabel = formatBRLShort(pjMonthlyGross);
  const winnerLabel = winner === 'pj' ? 'PJ' : 'CLT';

  const calculationSteps = [
    `Salário CLT bruto de R$ ${formatBRL(clt.gross)} com INSS de R$ ${formatBRL(clt.inss)} e IRPF de R$ ${formatBRL(clt.irpf)} → líquido mensal de R$ ${formatBRL(clt.net)}.`,
    `Somamos FGTS (R$ ${formatBRL(clt.fgts)}/mês provisionado), 13º e férias líquidos e benefícios (VR, VT, plano) para chegar ao pacote total CLT de R$ ${formatBRL(clt.totalPackage)}/mês.`,
    `No PJ, faturamento de R$ ${formatBRL(pj.gross)} (${formatBRL(pjRate)}/h × ${hoursPerMonth}h) com ${pj.taxName}, pró-labore e contador → líquido PJ de R$ ${formatBRL(pj.net)}/mês.`,
    `Fator R simulado: ${pj.fatorRPercent?.toFixed(1)}% — impacto direto no anexo do Simples Nacional.`,
  ];

  const cltAdvantages = {
    entry: [
      'Isenção ou redução forte de IRPF até R$ 5.000 (Lei 15.270/2025) melhora o líquido CLT nesta faixa.',
      'FGTS, 13º e férias pagos pela empresa — você não precisa reservar do próprio bolso.',
      'Estabilidade e vínculo formal: seguro-desemprego, aviso prévio e carteira assinada.',
      'Plano de saúde e VR costumam ser subsidiados pelo empregador.',
    ],
    mid: [
      'Pacote total CLT inclui encargos que muita proposta PJ não compensa na prática.',
      'Benefícios corporativos (plano, VR, VT) somam centenas de reais por mês.',
      'Previsibilidade: salário cai todo mês, sem depender de emissão de NF ou inadimplência de cliente.',
      'Menos burocracia pessoal: sem contador, DAS ou obrigações acessórias.',
    ],
    high: [
      'Acima de R$ 10.000 CLT, encargos trabalhistas têm peso relevante no pacote total.',
      'Empresas grandes costumam oferecer plano de saúde robusto e bônus (PLR).',
      'CLT protege em cenários de demissão — relevante se você prioriza segurança familiar.',
      'Contribuição previdenciária já descontada — aposentadoria via INSS empregador.',
    ],
    premium: [
      'Faixas premium CLT ainda acumulam FGTS significativo (8% sobre salário alto).',
      'PLR e benefícios executivos podem inclinar a balança mesmo com proposta PJ agressiva.',
      'Estabilidade pesa mais quando há financiamento, filhos ou dependência de renda fixa.',
      'IRPF progressivo existe, mas o pacote de proteção CLT é difícil de replicar sozinho.',
    ],
  };

  const pjAdvantages = {
    entry: [
      'Proposta PJ costuma ser 30–50% acima do bruto CLT — margem para cobrir impostos e ainda sobrar.',
      'Flexibilidade para atender mais de um cliente e diversificar renda.',
      'Dedutibilidade de despesas operacionais (equipamento, software, home office).',
      'Negociação direta de valor/hora sem teto de convenção coletiva.',
    ],
    mid: [
      'Simples Nacional pode manter carga tributária competitiva com Fator R bem planejado.',
      'Líquido PJ frequentemente supera pacote CLT quando a proposta é 1,4× a 1,6× o salário.',
      'Liberdade geográfica e contratos remotos — comum em TI.',
      'Distribuição de lucros isenta (dentro das regras) aumenta o que vai para o bolso.',
    ],
    high: [
      'Propostas PJ de R$ 15k–25k são comuns em TI sênior — diferença bruta compensa perda de FGTS.',
      'Fator R e Anexo III reduzem DAS — contador especializado faz diferença real aqui.',
      'Possibilidade de otimizar pró-labore vs dividendos com assessoria contábil.',
      'Exportação de serviço (USD/EUR) amplifica vantagem PJ quando contrato é internacional.',
    ],
    premium: [
      'Acima de R$ 20k/mês PJ, Lucro Presumido ou Simples bem estruturado mantém eficiência tributária.',
      'Retenção de 10% sobre dividendos acima de R$ 50k/mês (Lei 15.270) afeta poucos nesta simulação, mas vale monitorar.',
      'Alta margem permite arcar com plano de saúde premium e previdência privada.',
      'Autonomia total sobre agenda e stack — atrativo para perfis sênior e consultores.',
    ],
  };

  const tierIntro = {
    entry: `Com CLT de R$ ${cltLabel}, você está na faixa onde a nova isenção de IR até R$ 5.000 muda o jogo. Muitas propostas PJ parecem tentadoras, mas a CLT recuperou terreno em 2026.`,
    mid: `CLT de R$ ${cltLabel} é o coração do mercado de TI brasileiro. É aqui que a maioria das propostas PJ de 1,5× o salário aparece — e onde a conta precisa ser feita com pacote total, não só líquido.`,
    high: `Acima de R$ 10.000 CLT, a conversa deixa de ser “MEI ou CLT” e vira Simples Nacional, Fator R e planejamento tributário. Proposta PJ de ~R$ ${pjLabel} é plausível para pleno/sênior.`,
    premium: `Faixa premium: CLT de R$ ${cltLabel} compete com PJ de R$ ${pjLabel}+. A diferença bruta é grande, mas impostos, contador e ausência de FGTS/13º pesam na decisão final.`,
  };

  const professionIntro = role
    ? `Este comparativo simula o cenário típico de **${role}** com remuneração CLT de R$ ${cltLabel} e proposta PJ equivalente a ~R$ ${pjLabel}/mês — perfil comum em tecnologia e produto digital.`
    : null;

  const conclusion =
    winner === 'pj'
      ? `Neste cenário padrão, a **PJ** entrega cerca de R$ ${formatBRL(Math.abs(diffMonthly))}/mês a mais que o pacote total CLT (R$ ${formatBRL(Math.abs(diffAnnual))}/ano). Isso não elimina riscos: estabilidade, férias pagas e FGTS ainda favorecem a CLT. Use a calculadora com seus benefícios reais antes de decidir.`
      : `Neste cenário padrão, a **CLT** mantém vantagem de R$ ${formatBRL(Math.abs(diffMonthly))}/mês no pacote total (R$ ${formatBRL(Math.abs(diffAnnual))}/ano). A proposta PJ precisaria subir ou incluir benefícios explícitos para empatar. Simule sua proposta exata na calculadora.`;

  const faq = [
    {
      q: `CLT R$ ${cltLabel} ou PJ R$ ${pjLabel}: qual ganha mais líquido?`,
      a: `Nesta simulação, ${winnerLabel} fica R$ ${formatBRL(Math.abs(diffMonthly))}/mês à frente. CLT líquido: R$ ${formatBRL(clt.net)} (pacote total: R$ ${formatBRL(clt.totalPackage)}). PJ líquido: R$ ${formatBRL(pj.net)}.`,
    },
    {
      q: 'Esse cálculo inclui benefícios?',
      a: 'Sim. Consideramos VR R$ 600, VT R$ 300, plano R$ 400 e seguro R$ 50 na CLT, além de FGTS, 13º e férias líquidos. Na PJ, incluímos DAS, pró-labore mínimo e contador R$ 350/mês.',
    },
    {
      q: 'Posso usar MEI nessa faixa?',
      a:
        pjMonthlyGross > 6750
          ? `Com faturamento PJ de R$ ${pjLabel}/mês, MEI não é opção (teto ~R$ 6.750/mês). A simulação usa Simples Nacional.`
          : `Com faturamento PJ de R$ ${pjLabel}/mês, MEI pode ser analisado — mas compare sempre com Simples se houver crescimento previsto.`,
    },
  ];

  if (type === 'case-study') {
    faq.unshift({
      q: `Por que comparar CLT R$ ${cltLabel} com PJ R$ ${pjLabel} especificamente?`,
      a: 'É um par comum de proposta: empresa oferece PJ com valor fixo mensal, não apenas múltiplo do salário. Simular o par exato evita distorção.',
    });
  }

  return {
    intro: professionIntro || tierIntro[tier],
    calculationSteps,
    cltAdvantages: cltAdvantages[tier],
    pjAdvantages: pjAdvantages[tier],
    conclusion,
    faq,
    readingTime: '7 min',
  };
}
