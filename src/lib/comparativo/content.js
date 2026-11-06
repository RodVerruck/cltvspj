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
    'Desenvolvedor Frontend': {
      intro: (clt, pj) =>
        `Para o **Desenvolvedor Frontend** (focado em React, Vue, Next.js e interfaces modernas), a transição de CLT de R$ ${clt} para PJ de ~R$ ${pj}/mês é muito frequente devido ao trabalho remoto. Com a tributação progressiva da CLT consumindo fatias elevadas em faixas plenas, a PJ no Simples Nacional com Anexo III garante maior liquidez mensal para investir em equipamento e previdência própria.`,
      faq: [
        {
          q: 'Qual o CNAE correto para Desenvolvedor Frontend abrir CNPJ?',
          a: 'Geralmente utiliza o CNAE 6201-5/00 (Desenvolvimento de programas de computador sob encomenda). Essa atividade é elegível ao Simples Nacional e pode ser tributada no Anexo III (alíquota inicial de 6%) desde que cumpra a regra do Fator R com pró-labore de pelo menos 28%.',
        },
        {
          q: 'Dev Frontend PJ pode prestar serviços para múltiplos clientes?',
          a: 'Sim. Uma das principais vantagens do regime PJ em frontend é a possibilidade de manter um contrato fixo de dedicação parcial e prestar consultorias adicionais para outras empresas, multiplicando a renda bruta.',
        },
      ],
    },
    'Desenvolvedor Backend': {
      intro: (clt, pj) =>
        `No mercado de **Desenvolvedor Backend** (Node.js, Java, Python, Go, Cloud e Microsserviços), a comparação entre CLT de R$ ${clt} e PJ de ~R$ ${pj}/mês reflete a alta valorização técnica da função. Além de permitir contratos no Brasil, a estrutura PJ prepara o desenvolvedor para receber contratos do exterior em moeda forte com isenção de tributos municipais e federais de exportação.`,
      faq: [
        {
          q: 'Como funciona o Fator R para Desenvolvedor Backend no Simples Nacional?',
          a: 'O Fator R exige que o somatório de despesas com folha de pagamento (incluindo o pró-labore do sócio) represente no mínimo 28% do faturamento da empresa nos últimos 12 meses. Atingindo essa meta, a tributação cai de 15,5% (Anexo V) para 6% (Anexo III).',
        },
        {
          q: 'Vale a pena manter contrato PJ com empresa estrangeira sendo Backend?',
          a: 'Sim. Serviços de software prestados para o exterior têm isenção de PIS, COFINS e ISS no Brasil, resultando em uma alíquota efetiva de Simples Nacional ainda menor, frequentemente em torno de 3% a 4%.',
        },
      ],
    },
    'Desenvolvedor Full Stack': {
      intro: (clt, pj) =>
        `O **Desenvolvedor Full Stack** combina domínio de frontend, backend e infraestrutura básica, sendo um dos profissionais mais disputados por startups e scale-ups. Comparando CLT de R$ ${clt} com PJ de ~R$ ${pj}/mês, a autonomia do contrato de prestação de serviços compensa encargos formais se o profissional souber precificar sua hora com o multiplicador de equilíbrio adequado.`,
      faq: [
        {
          q: 'Qual a proporção mínima de PJ para Full Stack em relação ao CLT?',
          a: 'No mercado de desenvolvimento de software, recomenda-se que a proposta PJ seja de no mínimo 1,45× a 1,6× o salário CLT bruto para repor integralmente férias remuneradas, 13º salário, FGTS e benefícios de saúde corporativos.',
        },
        {
          q: 'Desenvolvedor Full Stack pode ser MEI?',
          a: 'Não. O desenvolvimento e arquitetura de software é atividade intelectual expressamente vedada ao MEI pela legislação federal. É necessário abrir uma ME (Microempresa), preferencialmente como Sociedade Limitada Unipessoal (SLU).',
        },
      ],
    },
    'Analista de Segurança da Informação': {
      intro: (clt, pj) =>
        `O **Analista de Segurança da Informação** (Cibersegurança, DevSecOps, Pentest e Cloud Security) atua na proteção contra incidentes e conformidade LGPD/ISO. Comparando CLT de R$ ${clt} com proposta PJ de ~R$ ${pj}/mês, o modelo PJ viabiliza honorários premium e acordos B2B com cláusulas claras de sobreaviso ou atendimento a incidentes críticos.`,
      faq: [
        {
          q: 'Como é tributada a atividade de consultoria em segurança da informação?',
          a: 'Pode ser enquadrada em CNAEs de suporte técnico e consultoria em TI (como 6202-3/00 ou 6209-1/00), enquadrados no Simples Nacional. O Fator R permite tributar no Anexo III (6%) mantendo pró-labore regular.',
        },
        {
          q: 'Quais cuidados contratuais o profissional PJ de segurança deve tomar?',
          a: 'É fundamental ter cláusulas de limitação de responsabilidade civil em contrato de prestação de serviços, além de definir claramente escopo de atuação para não assumir responsabilidade pessoal por incidentes cibernéticos imprevistos.',
        },
      ],
    },
    'Product Designer': {
      intro: (clt, pj) =>
        `O **Product Designer** lidera a estratégia de experiência do usuário, design systems e interfaces de produto. Com CLT de R$ ${clt} vs PJ de ~R$ ${pj}/mês, a modalidade PJ permite deduzir despesas com ferramentas de design (Figma, Adobe, plataformas de teste) e atuar para mais de um produto ou cliente em paralelo.`,
      faq: [
        {
          q: 'Product Designer pode atuar como MEI?',
          a: 'A atividade de design de produto e software envolve criação intelectual regulada e geralmente não se enquadra nas ocupações permitidas pelo MEI. O caminho seguro é constituir uma ME no Simples Nacional.',
        },
        {
          q: 'Qual o segredo para economizar imposto como Product Designer PJ?',
          a: 'Alinhar o pró-labore ao patamar de 28% do faturamento para usufruir da alíquota de 6% no Anexo III do Simples Nacional, garantindo que o restante dos rendimentos seja distribuído como lucros isentos de IRPF.',
        },
      ],
    },
    'Gestor de Tráfego': {
      intro: (clt, pj) =>
        `O **Gestor de Tráfego** (mídia paga em Meta Ads, Google Ads, TikTok e LinkedIn) é uma das carreiras mais pejotizadas do mercado digital. Na comparação entre CLT de R$ ${clt} e faturamento PJ de ~R$ ${pj}/mês, a flexibilidade da PJ permite cobrar valores fixos mais percentual sobre performance das campanhas gerenciadas.`,
      faq: [
        {
          q: 'Como separar a verba de anúncios da receita própria do Gestor PJ?',
          a: 'Nunca receba a verba dos anúncios dos clientes na sua conta bancária da empresa. Os clientes devem pagar as plataformas de anúncios diretamente com seus próprios cartões ou boletos, emitindo NF apenas sobre o seu serviço de gestão.',
        },
        {
          q: 'Gestor de tráfego pode ser MEI?',
          a: 'Depende do CNAE. Atividades de consultoria de marketing e agenciamento de publicidade não são permitidas no MEI. A maioria dos gestores profissionais opera como Microempresa no Simples Nacional para evitar autuações fiscais.',
        },
      ],
    },
    'Engenheiro Civil': {
      intro: (clt, pj) =>
        `Para o **Engenheiro Civil**, com atuação em projetos, laudos, reformas e gestão de obras, a comparação entre CLT de R$ ${clt} e remuneração PJ de ~R$ ${pj}/mês é recorrente em construtoras e escritórios de engenharia. Como a profissão é regulamentada pelo Confea/Crea, a prestação de serviços exige ART técnica e planejamento tributário cuidadoso.`,
      faq: [
        {
          q: 'Engenheiro Civil pode ser MEI?',
          a: 'Não. Engenharia civil é profissão regulamentada por conselho de classe e tem vedação expressa ao MEI. A empresa deve ser aberta como ME no Simples Nacional ou Lucro Presumido, com registro no Crea.',
        },
        {
          q: 'Como funciona o imposto do Engenheiro Civil no Simples Nacional?',
          a: 'Serviços de engenharia e elaboração de projetos entram por padrão no Anexo V (iniciando em 15,5%). Porém, com o Fator R (folha/pró-labore ≥ 28%), o imposto cai para o Anexo III (a partir de 6%), gerando economia brutal.',
        },
      ],
    },
    'Arquiteto e Urbanista': {
      intro: (clt, pj) =>
        `Para o **Arquiteto e Urbanista**, comparando CLT de R$ ${clt} com PJ de ~R$ ${pj}/mês, a flexibilidade de ter um CNPJ próprio viabiliza tanto a contratação contínua por escritórios de arquitetura quanto a captação de clientes próprios para projetos residenciais e comerciais, registrando o RRT no CAU.`,
      faq: [
        {
          q: 'Arquiteto e Urbanista pode abrir MEI?',
          a: 'Não. Arquitetura é atividade intelectual e regulamentada pelo Conselho de Arquitetura e Urbanismo (CAU), vedada ao MEI. A estrutura ideal é a Sociedade Limitada Unipessoal (SLU) no Simples Nacional.',
        },
        {
          q: 'Como pagar menos imposto como Arquiteto PJ?',
          a: 'Utilizando o Fator R no Simples Nacional. Com um pró-labore planejado de 28% do faturamento, a alíquota de impostos sobre as notas emitidas cai para 6% no Anexo III, em vez dos 15,5% do Anexo V.',
        },
      ],
    },
    'Médico Plantonista': {
      intro: (clt, pj) =>
        `O **Médico Plantonista** vivencia uma das maiores taxas de contratação PJ no Brasil, já que grande parte dos hospitais, operadoras e clínicas privadas contrata exclusivamente via CNPJ. Comparando CLT de R$ ${clt} com faturamento PJ de ~R$ ${pj}/mês, a retenção de 27,5% de IRPF na pessoa física torna a PJ uma decisão quase mandatória para preservação patrimonial.`,
      faq: [
        {
          q: 'Médico pode ser MEI para dar plantão?',
          a: 'De forma alguma. A medicina é profissão regulamentada pelo CFM/CRM e estritamente proibida no MEI. Médicos devem constituir empresa médica (ME) com registro no CRM PJ do seu estado.',
        },
        {
          q: 'Qual o melhor regime tributário para Médico Plantonista PJ?',
          a: 'Para quem atua sozinho dando plantões, o Simples Nacional com Fator R (atingindo pró-labore de 28% para tributar a 6% no Anexo III) costuma ser o mais econômico. Conforme o faturamento escala acima de R$ 30k/mês ou ocorram despesas médicas clínicas, o Lucro Presumido (com equiparação hospitalar se aplicável) deve ser comparado.',
        },
      ],
    },
    'Psicólogo Clínico': {
      intro: (clt, pj) =>
        `Para o **Psicólogo Clínico**, comparando vínculos CLT de R$ ${clt} (comum em RH ou hospitais) com atendimento PJ em clínicas ou plataformas online de ~R$ ${pj}/mês, o CNPJ oferece formalização profissional para emissão de notas fiscais exigidas por planos de saúde para reembolso de pacientes e redução de imposto sobre consultas.`,
      faq: [
        {
          q: 'Psicólogo pode ser MEI?',
          a: 'Não. A psicologia é profissão regulamentada pelo CFP/CRP e não consta na lista de ocupações permitidas do MEI. O psicólogo deve abrir uma microempresa no Simples Nacional.',
        },
        {
          q: 'Como funciona o imposto do Psicólogo no Simples Nacional?',
          a: 'A atividade de psicologia está sujeita ao Fator R. Se a despesa de pró-labore representar pelo menos 28% do faturamento, o imposto começa em 6% no Anexo III. Sem esse planejamento, cai no Anexo V a 15,5%.',
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
