import { TAX_RULES } from './tax-rules/index.js';

export const calculateINSS = (sal) => {
  const bands = TAX_RULES.inss.bands;
  let inss = 0;
  let prev = 0;
  for (const { limit, rate } of bands) {
    if (sal <= prev) break;
    inss += (Math.min(sal, limit) - prev) * rate;
    prev = limit;
  }
  return inss;
};

export function aplicarRedutorLei15270(rendimentoTributavel, irTradicional) {
  const rule = TAX_RULES.law15270;
  if (rendimentoTributavel <= rule.exemptionLimit) {
    return 0;
  }
  if (rendimentoTributavel <= rule.reductionLimit) {
    // Formula oficial Lei 15.270/2025: Redução = R$ 978,62 - (0,133145 × rendimentoTributavel)
    const reducao = rule.formula.a - (rule.formula.b * rendimentoTributavel);
    const impostoFinal = irTradicional - Math.max(0, reducao);
    return Math.max(0, impostoFinal);
  }
  return irTradicional;
}

const calculateIRPFForBase = (irpfBase, grossAmount) => {
  const irpfRules = TAX_RULES.irpf.faixas;
  let irpfTradicional = 0;
  
  if (irpfBase > irpfRules.faixa4.limit) {
    irpfTradicional = irpfBase * irpfRules.faixa5.rate - irpfRules.faixa5.deduction;
  } else if (irpfBase > irpfRules.faixa3.limit) {
    irpfTradicional = irpfBase * irpfRules.faixa4.rate - irpfRules.faixa4.deduction;
  } else if (irpfBase > irpfRules.faixa2.limit) {
    irpfTradicional = irpfBase * irpfRules.faixa3.rate - irpfRules.faixa3.deduction;
  } else if (irpfBase > irpfRules.isencao) {
    irpfTradicional = irpfBase * irpfRules.faixa2.rate - irpfRules.faixa2.deduction;
  }
  
  return aplicarRedutorLei15270(grossAmount, Math.max(irpfTradicional, 0));
};

export const calculateIRPF = (grossAmount, dependentes = 0, pensaoAlimenticia = 0) => {
  const inss = calculateINSS(grossAmount);
  const simplifiedDeduction = TAX_RULES.irpf.simplifiedDeduction;
  const numDependentes = parseInt(dependentes) || 0;
  const valorPensao = parseFloat(pensaoAlimenticia) || 0;
  const deducaoDependentes = numDependentes * TAX_RULES.irpf.dependentDeduction;
  
  // Opção A: Deduções Legais (neste caso: INSS + Dependentes + Pensão Judicial)
  const baseDeducoesLegais = Math.max(0, grossAmount - inss - deducaoDependentes - valorPensao);
  const irpfDeducoesLegais = calculateIRPFForBase(baseDeducoesLegais, grossAmount);
  
  // Opção B: Desconto Simplificado (substitui todas as deduções legais, desconta apenas o simplificado fixo)
  const baseDescontoSimplificado = Math.max(0, grossAmount - simplifiedDeduction);
  const irpfDescontoSimplificado = calculateIRPFForBase(baseDescontoSimplificado, grossAmount);
  
  // O imposto retido é o menor e mais vantajoso para o contribuinte
  return Math.min(irpfDeducoesLegais, irpfDescontoSimplificado);
};

export const calculatePLR = (plrAmount) => {
  const amount = parseFloat(plrAmount) || 0;
  if (amount === 0) return { gross: 0, irpf: 0, net: 0 };
  const bands = TAX_RULES.plr.bands;
  let irpf = 0;
  for (const band of bands) {
    if (amount <= band.limit) {
      irpf = amount * band.rate - band.deduction;
      break;
    }
  }
  return {
    gross: amount,
    irpf: Math.max(0, irpf),
    net: Math.max(0, amount - Math.max(0, irpf))
  };
};

export const calculateCLT = (salary, benefits, dependentes = 0, pensaoAlimenticia = 0, plrAnual = 0) => {
  const sal = parseFloat(salary) || 0;
  if (sal === 0) return { gross: 0, net: 0, benefits: 0, inss: 0, irpf: 0, fgts: 0, decimoTerceiro: 0, ferias: 0, plr: 0, totalPackage: 0, inssAnualCLT: 0 };

  const totalBenefits = Object.values(benefits).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);

  const inss = calculateINSS(sal);
  const irpf = calculateIRPF(sal, dependentes, pensaoAlimenticia);
  const netSalary = sal - inss - irpf;

  const fgts = sal * 0.08;

  // Benefícios anuais: cálculo do valor LÍQUIDO (descontando INSS e IRPF reais)
  // 13º Salário
  const gross13 = sal;
  const inss13 = calculateINSS(gross13);
  const irpf13 = calculateIRPF(gross13, dependentes, pensaoAlimenticia);
  const net13 = gross13 - inss13 - irpf13;
  const decimoTerceiroMensal = net13 / 12;

  // Férias (1/3 adicional)
  const grossFerias = sal * (4/3);
  const inssFerias = calculateINSS(grossFerias);
  const irpfFerias = calculateIRPF(grossFerias, dependentes, pensaoAlimenticia);
  const netFerias = grossFerias - inssFerias - irpfFerias;
  const feriasMensal = netFerias / 12;

  // PLR / Bônus Anual
  const plrCalculada = calculatePLR(plrAnual);
  const plrMensal = plrCalculada.net / 12;

  // Contribuição previdenciária anual CLT
  const inssAnualCLT = (inss * 12) + inss13 + inssFerias;

  return {
    gross: sal,
    net: netSalary + totalBenefits,
    benefits: totalBenefits,
    inss,
    irpf,
    fgts,
    decimoTerceiro: decimoTerceiroMensal,
    ferias: feriasMensal,
    plr: plrMensal,
    totalPackage: netSalary + totalBenefits + fgts + decimoTerceiroMensal + feriasMensal + plrMensal,
    inssAnualCLT
  };
};

export const calculatePJ = (
  pjRate, 
  hoursPerMonth, 
  regime = 'simples', 
  faturamento12Meses = 0, 
  proLaboreInput = 'padrao', 
  folha12Meses = 0, 
  issRate = 3,
  dependentes = 0,
  pensaoAlimenticia = 0,
  mensalidadeContador = 0,
  isOtimizacaoSimulada = false
) => {
  const rate = parseFloat(pjRate) || 0;
  const hours = parseFloat(hoursPerMonth) || 0;
  const monthlyGross = rate * hours;

  let pjTax = 0;
  let taxName = '';
  let isInvalidMEI = false;
  let proLabore = 0;
  let inssPatronal = 0;

  // Detalhes adicionais para Lucro Presumido
  let lpIRPJ = 0;
  let lpCSLL = 0;
  let lpPIS = 0;
  let lpCOFINS = 0;
  let lpISS = 0;
  let lpAdicionalIRPJ = 0;

  // Determinar valor nominal do Pró-labore bruto mensal
  if (regime === 'mei') {
    proLabore = 0;
  } else {
    // Para Simples e Lucro Presumido
    if (proLaboreInput === 'minimo' || proLaboreInput === '1621') {
      proLabore = TAX_RULES.salaryMinimum;
    } else if (proLaboreInput === '3000') {
      proLabore = 3000.00;
    } else if (proLaboreInput === '5000') {
      proLabore = 5000.00;
    } else if (proLaboreInput === '8000') {
      proLabore = 8000.00;
    } else if (proLaboreInput === 'padrao') {
      if (regime === 'presumido') {
        proLabore = TAX_RULES.salaryMinimum;
      } else {
        // Simples Nacional: assume fator R idealizado (28% do faturamento ou salário mínimo)
        proLabore = Math.max(TAX_RULES.salaryMinimum, monthlyGross * 0.28);
      }
    } else {
      // Personalizado ou numérico
      const numericVal = parseFloat(proLaboreInput) || 0;
      proLabore = numericVal > 0 ? numericVal : TAX_RULES.salaryMinimum;
    }
  }

  if (regime === 'mei') {
    const rulesMei = TAX_RULES.simples;
    const faturamentoAnualMEI = Number(faturamento12Meses) > 0 ? Number(faturamento12Meses) : monthlyGross * 12;
    if (faturamentoAnualMEI > rulesMei.meiTetoAnual) isInvalidMEI = true;
    pjTax = rulesMei.meiDasMensal;
    taxName = 'DAS MEI (Fixo)';
    proLabore = 0;
  } else if (regime === 'presumido') {
    const rulesPresumido = TAX_RULES.presumido;
    const userIss = (parseFloat(issRate) || 3) / 100;

    // Impostos Corporativos isolados
    lpIRPJ = monthlyGross * rulesPresumido.irpjRate;
    lpCSLL = monthlyGross * rulesPresumido.csllRate;
    lpPIS = monthlyGross * rulesPresumido.pisRate;
    lpCOFINS = monthlyGross * rulesPresumido.cofinsRate;
    lpISS = monthlyGross * userIss;

    // Adicional de IRPJ
    const lucroPresumido = monthlyGross * rulesPresumido.presumptionRate;
    if (lucroPresumido > rulesPresumido.irpjAdditionalLimit) {
      lpAdicionalIRPJ = (lucroPresumido - rulesPresumido.irpjAdditionalLimit) * rulesPresumido.irpjAdditionalRate;
    }

    pjTax = lpIRPJ + lpCSLL + lpPIS + lpCOFINS + lpISS + lpAdicionalIRPJ;

    inssPatronal = proLabore * rulesPresumido.inssPatronalRate;
    const taxPctLabel = ((rulesPresumido.irpjRate + rulesPresumido.csllRate + rulesPresumido.pisRate + rulesPresumido.cofinsRate + userIss) * 100).toFixed(2).replace('.', ',');
    taxName = `Impostos L. Presumido (${taxPctLabel}%${lpAdicionalIRPJ > 0 ? ' + Adic. IRPJ' : ''})`;
  } else {
    // Simples Nacional
    const rbt12 = Number(faturamento12Meses) > 0 ? Number(faturamento12Meses) : monthlyGross * 12;
    const folha12 = Number(folha12Meses) > 0 ? Number(folha12Meses) : proLabore * 12;

    // Calcular Fator R real ou baseado na anualização implícita
    const fatorR = rbt12 > 0 ? (folha12 / rbt12) : 0;
    const simplesRules = TAX_RULES.simples;

    let isAnexo3 = true;
    let bands = simplesRules.anexo3Bands;

    // Se Fator R for menor que 28%, cai no Anexo V
    if (fatorR < 0.28) {
      isAnexo3 = false;
      bands = simplesRules.anexo5Bands;
    }

    let aliquotaNominal = 0;
    let deducao = 0;

    for (const band of bands) {
      if (rbt12 <= band.limit) {
        aliquotaNominal = band.rate;
        deducao = band.deduction;
        break;
      }
    }

    const aliquotaEfetiva = rbt12 > 0 ? (rbt12 * aliquotaNominal - deducao) / rbt12 : bands[0].rate;

    // Se RBT12 > sublimite do Simples Nacional, o ISS (5%) é cobrado por fora
    const issSeparado = rbt12 > simplesRules.issSeparadoLimit ? monthlyGross * 0.05 : 0;
    pjTax = (monthlyGross * aliquotaEfetiva) + issSeparado;

    const aliqPct = (aliquotaEfetiva * 100).toFixed(2).replace('.', ',');
    taxName = `DAS Simples Anexo ${isAnexo3 ? 'III' : 'V'} (${aliqPct}%)${issSeparado > 0 ? ' + ISS 5%' : ''}`;
  }

  let inssSocio = 0;
  let irpfSocio = 0;
  if (proLabore > 0) {
    inssSocio = Math.min(proLabore, TAX_RULES.inss.ceiling) * 0.11;
    irpfSocio = calculateIRPF(proLabore, dependentes, pensaoAlimenticia);
  }

  // Fluxo de caixa e Dividendos
  const dividendGross = monthlyGross - pjTax - inssPatronal - proLabore;
  const dividendTax = 0; 
  const dividendNet = dividendGross - dividendTax;
  const proLaboreNet = proLabore - inssSocio - irpfSocio;
  const netMonthly = dividendNet + proLaboreNet;
  
  // Líquido pós-custos operacionais (sem afetar o rendimento líquido principal de comparação tributária)
  const netMonthlyPosCustos = netMonthly - parseFloat(mensalidadeContador || 0);

  const totalTaxes = pjTax + inssPatronal + inssSocio + irpfSocio + dividendTax;

  // Previdência Anual PJ
  const inssAnualPJ = inssSocio * 12;

  // Metadados do Fator R e cenário otimizado
  let fatorR = 0;
  let fatorRPercent = 0;
  let isFatorREstimado = false;
  let anexo = 'III';
  let motivoEnquadramento = '';
  let rbt12Utilizado = monthlyGross * 12;
  let folhaUtilizada = proLabore * 12;
  let fatorROptimization = null;

  if (regime === 'simples') {
    const rbt12 = Number(faturamento12Meses) > 0 ? Number(faturamento12Meses) : monthlyGross * 12;
    const folha12 = Number(folha12Meses) > 0 ? Number(folha12Meses) : proLabore * 12;
    fatorR = rbt12 > 0 ? (folha12 / rbt12) : 0;
    fatorRPercent = fatorR * 100;
    isFatorREstimado = !folha12Meses;
    anexo = fatorR >= 0.28 ? 'III' : 'V';
    rbt12Utilizado = rbt12;
    folhaUtilizada = folha12;

    if (isFatorREstimado) {
      motivoEnquadramento = `Fator R estimado com base no pró-labore selecionado. Para maior precisão, informe o histórico real.`;
    } else if (fatorR >= 0.28) {
      motivoEnquadramento = `Folha de pagamento acumulada representa ${fatorRPercent.toFixed(2).replace('.', ',')}% do faturamento acumulado (RBT12), acima do mínimo de 28% exigido para o Anexo III.`;
    } else {
      motivoEnquadramento = `Folha de pagamento acumulada representa apenas ${fatorRPercent.toFixed(2).replace('.', ',')}% do faturamento acumulado (RBT12), abaixo do mínimo de 28% exigido para o Anexo III.`;
    }

    if (fatorR < 0.28 && !isOtimizacaoSimulada) {
      const folhaIdeal12m = rbt12 * 0.28;
      const folhaFaltante12m = Math.max(0, folhaIdeal12m - folha12);
      const folhaFaltanteMensal = folhaFaltante12m / 12;
      const novoProLaboreSimulado = proLabore + folhaFaltanteMensal;

      // Executa o cenário otimizado para Simples Nacional
      const resultadoOtimizado = calculatePJ(
        pjRate,
        hoursPerMonth,
        'simples',
        faturamento12Meses,
        novoProLaboreSimulado.toString(),
        folhaIdeal12m,
        issRate,
        dependentes,
        pensaoAlimenticia,
        mensalidadeContador,
        true // isOtimizacaoSimulada
      );

      fatorROptimization = {
        folhaIdeal12m,
        folhaFaltante12m,
        folhaFaltanteMensal,
        novoProLabore: novoProLaboreSimulado,
        pontosPercentuaisFaltantes: 28 - fatorRPercent,
        dasOtimizado: resultadoOtimizado.simplesDAS,
        inssOtimizado: resultadoOtimizado.inssProLabore,
        irpfOtimizado: resultadoOtimizado.irpfProLabore,
        netOtimizado: resultadoOtimizado.net,
        economiaDas: pjTax - resultadoOtimizado.simplesDAS,
        inssAdicional: resultadoOtimizado.inssProLabore - inssSocio,
        irpfAdicional: resultadoOtimizado.irpfProLabore - irpfSocio,
        ganhoLiquidoReal: resultadoOtimizado.net - netMonthly
      };
    }
  }

  // Lógica dos metadados de consultoria contábil e pré-diagnóstico tributário
  const rbt12 = regime === 'mei' 
    ? (Number(faturamento12Meses) > 0 ? Number(faturamento12Meses) : monthlyGross * 12)
    : (regime === 'presumido' ? monthlyGross * 12 : rbt12Utilizado);

  // 1. Qualidade dos Dados
  let dadosQualidade = 'estimados';
  let dadosQualidadeLabel = 'Dados parcialmente estimados';
  let dadosQualidadeMsg = 'Alguns valores foram estimados. Os resultados servem como referência inicial e podem variar na prática.';

  if (regime === 'simples') {
    const isFronteira = (fatorRPercent >= 26 && fatorRPercent <= 30);
    const hasInputs = Number(faturamento12Meses) > 0 && Number(folha12Meses) > 0;
    
    if (isFronteira || monthlyGross > 30000) {
      dadosQualidade = 'revisao_especializada';
      dadosQualidadeLabel = 'Revisão especializada recomendada';
      dadosQualidadeMsg = 'Pequenas alterações no pró-labore, folha ou enquadramento tributário podem alterar significativamente o resultado. Recomenda-se revisão contábil especializada.';
    } else if (hasInputs) {
      dadosQualidade = 'completos';
      dadosQualidadeLabel = 'Dados completos';
      dadosQualidadeMsg = 'Simulação baseada em dados reais de faturamento e folha informados pelo usuário.';
    }
  } else if (regime === 'presumido') {
    dadosQualidade = 'revisao_especializada';
    dadosQualidadeLabel = 'Revisão especializada recomendada';
    dadosQualidadeMsg = 'O regime de Lucro Presumido possui particularidades tributárias complexas. Recomenda-se revisão especializada.';
  }

  // 2. Nível de Confiança do Fator R (Apenas Simples)
  let nivelConfiancaFatorR = 'baixa';
  if (regime === 'simples') {
    if (Number(faturamento12Meses) > 0 && Number(folha12Meses) > 0) {
      nivelConfiancaFatorR = 'alta';
    } else if (Number(faturamento12Meses) > 0) {
      nivelConfiancaFatorR = 'media';
    }
  }

  // 3. Potencial de Planejamento Tributário
  let potencialPlanejamento = 'baixo';
  let potencialPlanejamentoLabel = 'Baixo potencial';
  let potencialPlanejamentoMsg = 'Sua estrutura tributária atual está próxima do ideal matemático simulado.';

  const isFronteiraFatorR = (regime === 'simples' && fatorRPercent >= 26 && fatorRPercent <= 30);
  if ((regime === 'simples' && fatorR < 0.28) || regime === 'presumido' || isFronteiraFatorR) {
    potencialPlanejamento = 'alto';
    potencialPlanejamentoLabel = 'Alto potencial';
    potencialPlanejamentoMsg = 'Seu enquadramento ou limite sugere que existem oportunidades reais de revisão da estrutura tributária.';
  } else if (regime === 'simples' && isFatorREstimado) {
    potencialPlanejamento = 'medio';
    potencialPlanejamentoLabel = 'Médio potencial';
    potencialPlanejamentoMsg = 'Existem dados estimados. Uma revisão contábil simples pode confirmar o enquadramento ideal.';
  }

  // 4. Checklist de Análise Contábil
  const checklistContador = [];
  if (regime === 'simples') {
    if (fatorR < 0.28) {
      checklistContador.push(`• Seu Fator R atual está em ${fatorRPercent.toFixed(2).replace('.', ',')}%`);
      checklistContador.push(`• Sua empresa está tributada pelo Anexo V`);
      checklistContador.push(`• O simulador identificou potencial de redução da carga tributária sujeito à validação contábil`);
      checklistContador.push(`• Validar a composição da folha para fins de Fator R`);
    } else {
      checklistContador.push(`• Seu Fator R atual está em ${fatorRPercent.toFixed(2).replace('.', ',')}%`);
      checklistContador.push(`• Sua empresa está enquadrada no Anexo III`);
      checklistContador.push(`• A folha atual atende à meta de 28% do faturamento`);
      checklistContador.push(`• Validar o histórico de 12 meses para garantir a conformidade contínua`);
      checklistContador.push(`• Confirmar enquadramento do CNAE e estratégia ideal de distribuição de lucros`);
    }
  } else if (regime === 'presumido') {
    checklistContador.push(`• Confirmar enquadramento da alíquota de ISS municipal`);
    checklistContador.push(`• Avaliar conformidade do pró-labore e INSS Patronal (20%)`);
    checklistContador.push(`• Analisar distribuição de dividendos isentos acima da presunção`);
    checklistContador.push(`• Revisar se o Simples Nacional Anexo V/III é mais vantajoso`);
  } else {
    checklistContador.push(`• Monitorar limite de faturamento anual de R$ 81.000`);
    checklistContador.push(`• Avaliar transição planejada para microempresa (ME)`);
  }

  // 5. Score de Oportunidade de Revisão (interno)
  let oportunidadeScore = 0;
  if (regime === 'simples' && fatorR < 0.28) oportunidadeScore += 4;
  if (regime === 'presumido') oportunidadeScore += 3;
  if (regime === 'simples' && fatorRPercent >= 26 && fatorRPercent <= 30) oportunidadeScore += 2;
  if (rbt12 > 180000) oportunidadeScore += 1;
  oportunidadeScore = Math.min(10, oportunidadeScore);

  // 6. Gatilho de CTA Contextual
  const ganhoFatorRReal = fatorROptimization ? fatorROptimization.ganhoLiquidoReal : 0;
  const showContadorCTA = (oportunidadeScore >= 6 || ganhoFatorRReal > 100);

  let ctaCaso = 'equilibrio';
  let ctaTexto = '';
  if (regime === 'simples' && fatorR < 0.28) {
    ctaCaso = 'anexo_v';
    ctaTexto = `Sua empresa está no Anexo V. O simulador identificou potencial de economia tributária caso o Fator R alcance 28%. Um contador pode avaliar se essa estratégia é viável no seu caso.`;
  } else if (regime === 'presumido') {
    ctaCaso = 'presumido';
    ctaTexto = `O Lucro Presumido envolve regras de ISS municipal, pró-labore e distribuição de lucros que variam conforme a atividade. Uma revisão especializada pode confirmar se esse regime é realmente o mais vantajoso.`;
  } else {
    ctaCaso = 'equilibrio';
    ctaTexto = `A diferença encontrada é estreita. Nessa situação, benefícios CLT, aposentadoria, estabilidade e estratégia empresarial podem ser tão relevantes quanto os impostos. Recomendamos falar com a equipe da Manassés.`;
  }

  const contabilidadeMetadata = {
    dadosQualidade,
    dadosQualidadeLabel,
    dadosQualidadeMsg,
    nivelConfiancaFatorR,
    potencialPlanejamento,
    potencialPlanejamentoLabel,
    potencialPlanejamentoMsg,
    checklistContador,
    oportunidadeScore,
    showContadorCTA,
    ctaCaso,
    ctaTexto
  };

  return {
    gross: monthlyGross,
    net: netMonthly,
    netMonthlyPosCustos,
    simplesDAS: pjTax,
    inssProLabore: inssSocio,
    irpfProLabore: irpfSocio,
    inssPatronal,
    dividendTax,
    totalTaxes,
    taxName,
    isInvalidMEI,
    proLabore,
    inssAnualPJ,
    fatorR,
    fatorRPercent,
    anexo,
    isFatorREstimado,
    motivoEnquadramento,
    rbt12Utilizado,
    folhaUtilizada,
    fatorROptimization,
    contabilidadeMetadata,
    lpIRPJ,
    lpCSLL,
    lpPIS,
    lpCOFINS,
    lpISS,
    lpAdicionalIRPJ
  };
};
