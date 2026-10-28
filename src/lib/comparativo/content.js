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

  const PROFESSION_PROFILES = {
    'Desenvolvedor Júnior': {
      intro: (clt, pj) =>
        `Para o início de carreira como **Desenvolvedor Júnior**, a escolha entre CLT de R$ ${clt} e proposta PJ equivalente a ~R$ ${pj}/mês envolve segurança vs aprendizado financeiro. Com a nova isenção de IRPF até R$ 5.000 (Lei 15.270/2025), o salário CLT tem desconto reduzido na fonte, enquanto os custos fixos de uma PJ (honorários de contador e taxa municipal) consomem percentual relevante da receita nessa faixa salarial.`,
      faq: [
        {
          q: 'Desenvolvedor Júnior pode ser MEI para pagar menos imposto?',
          a: 'Não. A atividade de desenvolvimento e programação de software (CNAE 6201-5/00) é considerada atividade intelectual regulamentada e vedada ao MEI. O profissional deve constituir Microempresa (ME) enquadrada no Simples Nacional.',
        },
        {
          q: 'Vale a pena ser PJ logo no início da carreira?',
          a: 'Em geral, a CLT oferece vantagens importantes nos primeiros anos: mentoria corporativa formal, férias remuneradas sem interrupção de receita, FGTS e estabilidade para constituição da primeira reserva de emergência.',
        },
      ],
    },
    'Tech Lead': {
      intro: (clt, pj) =>
        `A posição de **Tech Lead** combina liderança técnica, arquitetura de sistemas e coordenação de equipes. Com remuneração de R$ ${clt} na CLT vs ~R$ ${pj}/mês no PJ, a diferença tributária é acentuada: na CLT, a retenção de IRPF atinge a alíquota máxima de 27,5% e o teto do INSS. No modelo PJ, a aplicação correta do Fator R no Anexo III do Simples Nacional ou até Lucro Presumido permite reter uma parcela substancialmente maior no bolso.`,
      faq: [
        {
          q: 'Qual o melhor enquadramento tributário para Tech Lead PJ?',
          a: 'Para faturamentos entre R$ 25k e R$ 30k/mês, o Simples Nacional com Fator R (retirando pró-labore de pelo menos 28% para tributar no Anexo III a partir de 6%) é normalmente a estrutura mais vantajosa. Se o faturamento anual ultrapassar a faixa inicial ou tiver despesas dedutíveis reduzidas, o Lucro Presumido deve ser avaliado pelo contador.',
        },
        {
          q: 'Como proteger a remuneração de liderança em contratos PJ?',
          a: 'Como não há aviso prévio obrigatório ou multa rescisória de 40% do FGTS na PJ, contratos de Tech Lead costumam exigir cláusulas claras de aviso prévio contratual (30 a 60 dias) e honorários extras para períodos de transição ou sobreaviso.',
        },
      ],
    },
    'Engenheiro de Dados': {
      intro: (clt, pj) =>
        `O **Engenheiro de Dados** atua na espinha dorsal das plataformas de Big Data, Cloud e IA corporativa. Comparando CLT de R$ ${clt} com PJ de ~R$ ${pj}/mês, a alta demanda por esse perfil permite flexibilidade para múltiplos contratos ou prestação de serviços internacional. A escolha pelo PJ viabiliza maior rentabilidade líquida mensal, desde que o profissional reserve recursos para férias e plano de saúde por conta própria.`,
      faq: [
        {
          q: 'Engenheiro de Dados PJ pode prestar serviços para clientes do exterior?',
          a: 'Sim. Na exportação de serviços de tecnologia, a empresa PJ fica isenta de PIS, COFINS e ISS no Brasil, reduzindo expressivamente a carga tributária na nota fiscal sobre recebimentos em dólar ou euro.',
        },
        {
          q: 'Qual CNAE o Engenheiro de Dados costuma utilizar no CNPJ?',
          a: 'Geralmente utiliza o CNAE 6201-5/00 (Desenvolvimento de programas de computador sob encomenda) ou 6311-9/00 (Tratamento de dados, provedores de serviços de aplicação e serviços de hospedagem na internet), ambos elegíveis ao Simples Nacional com regra do Fator R.',
        },
      ],
    },
    'Arquiteto de Software': {
      intro: (clt, pj) =>
        `No nível de **Arquiteto de Software**, comparando CLT de R$ ${clt} com proposta PJ de ~R$ ${pj}/mês, a tributação progressiva da CLT gera retenções superiores a R$ 5.000 mensais em impostos diretos. No regime PJ, com planejamento tributário focado em pró-labore ótimo e distribuição de lucros isenta, a rentabilidade líquida do profissional cresce de forma muito expressiva, compensando encargos rescisórios celetistas.`,
      faq: [
        {
          q: 'A tributação sobre dividendos da Lei 15.270 atinge o Arquiteto PJ?',
          a: 'A retenção de 10% sobre dividendos prevista na legislação atinge retiradas que excedam R$ 50.000 mensais por pessoa física. Para rendas líquidas mensais na faixa de R$ 25k a R$ 40k, a distribuição de lucros permanece 100% isenta no Brasil.',
        },
        {
          q: 'Vale a pena abrir como SLU para Arquiteto de Software?',
          a: 'Sim. A Sociedade Limitada Unipessoal (SLU) é o formato padrão mais recomendado, pois protege o patrimônio pessoal do arquiteto separando-o do patrimônio da empresa, sem a necessidade de incluir sócios fictícios.',
        },
      ],
    },
    'Desenvolvedor Mobile': {
      intro: (clt, pj) =>
        `Para o **Desenvolvedor Mobile** (iOS, Android, Flutter, React Native), a comparação entre CLT de R$ ${clt} e PJ de ~R$ ${pj}/mês é muito frequente em startups e agências digitais. Como os projetos costumam exigir equipamentos dedicados (como MacBooks e aparelhos físicos de teste), o regime PJ permite utilizar a receita da empresa para aquisição de instrumentos de trabalho, reduzindo o impacto no orçamento pessoal.`,
      faq: [
        {
          q: 'Como funciona o recolhimento de ISS para Desenvolvedor Mobile PJ?',
          a: 'No Simples Nacional, o ISS já é recolhido de forma unificada dentro da guia única (DAS), variando de 2% a 5% conforme a alíquota municipal da sede da sua empresa, sem a necessidade de emissão de guias municipais avulsas.',
        },
        {
          q: 'Desenvolvedor Mobile PJ pode manter aplicativos próprios na App Store?',
          a: 'Sim. O mesmo CNPJ utilizado para prestar serviços para empresas pode ser cadastrado como desenvolvedor corporativo na Apple Developer e Google Play Console, unificando a receita de serviços e eventuais monetizações diretas de apps.',
        },
      ],
    },
    'Desenvolvedor Pleno': {
      intro: (clt, pj) =>
        `Para o **Desenvolvedor Pleno**, a proposta PJ de ~R$ ${pj}/mês contra CLT de R$ ${clt} é o ponto de virada clássico no mercado de tecnologia brasileiro. É aqui que o ganho líquido começa a superar os benefícios corporativos de forma sólida, exigindo apenas que o profissional tenha disciplina para guardar reservas de férias e emergência.`,
      faq: [
        {
          q: 'Qual o valor ideal de pró-labore para Dev Pleno no Simples?',
          a: 'Para pagar apenas 6% de imposto no Simples Nacional (Anexo III), a folha de pagamento com pró-labore deve ser de pelo menos 28% do faturamento mensal (regra do Fator R). Para R$ 13.950 de faturamento, o pró-labore deve ser de aproximadamente R$ 3.910/mês.',
        },
      ],
    },
    'Desenvolvedor Sênior': {
      intro: (clt, pj) =>
        `Para o **Desenvolvedor Sênior**, com remuneração CLT de R$ ${clt} e propostas PJ de ~R$ ${pj}/mês, a vantagem líquida da PJ costuma ser bastante expressiva. Os descontos de IRPF e INSS na CLT pesam no topo da tabela progressiva, enquanto no modelo PJ um planejamento contábil correto maximiza a renda disponível.`,
      faq: [
        {
          q: 'Como calcular o pacote total CLT para comparar com proposta PJ sênior?',
          a: 'Não compare apenas salário líquido com faturamento PJ. Some ao salário CLT: FGTS (8%), provisão mensal de 1/12 de 13º salário e férias (com 1/3 constitucional), além de plano de saúde e VR pagos pela empresa.',
        },
      ],
    },
  };

  const profProfile = role ? PROFESSION_PROFILES[role] : null;

  const professionIntro = profProfile
    ? profProfile.intro(cltLabel, pjLabel)
    : role
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

  if (profProfile?.faq) {
    faq.unshift(...profProfile.faq);
  }

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
