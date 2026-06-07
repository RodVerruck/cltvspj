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

const calculateIRPF = (grossAmount) => {
  const inss = calculateINSS(grossAmount);
  const simplifiedDeduction = TAX_RULES.irpf.simplifiedDeduction;
  
  // Opção A: Deduções Legais (neste caso, apenas INSS do funcionário)
  const baseDeducoesLegais = Math.max(0, grossAmount - inss);
  const irpfDeducoesLegais = calculateIRPFForBase(baseDeducoesLegais, grossAmount);
  
  // Opção B: Desconto Simplificado
  const baseDescontoSimplificado = Math.max(0, grossAmount - simplifiedDeduction);
  const irpfDescontoSimplificado = calculateIRPFForBase(baseDescontoSimplificado, grossAmount);
  
  // O imposto retido é o menor e mais vantajoso para o contribuinte
  return Math.min(irpfDeducoesLegais, irpfDescontoSimplificado);
};

export const calculateCLT = (salary, benefits) => {
  const sal = parseFloat(salary) || 0;
  if (sal === 0) return { gross: 0, net: 0, benefits: 0, inss: 0, irpf: 0, fgts: 0, decimoTerceiro: 0, ferias: 0, totalPackage: 0 };

  const totalBenefits = Object.values(benefits).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);

  const inss = calculateINSS(sal);
  const irpf = calculateIRPF(sal);
  const netSalary = sal - inss - irpf;

  const fgts = sal * 0.08;

  // Benefícios anuais: cálculo do valor LÍQUIDO (descontando INSS e IRPF reais)
  // 13º Salário
  const gross13 = sal;
  const inss13 = calculateINSS(gross13);
  const irpf13 = calculateIRPF(gross13);
  const net13 = gross13 - inss13 - irpf13;
  const decimoTerceiroMensal = net13 / 12;

  // Férias (1/3 adicional)
  const grossFerias = sal * (4/3);
  const inssFerias = calculateINSS(grossFerias);
  const irpfFerias = calculateIRPF(grossFerias);
  const netFerias = grossFerias - inssFerias - irpfFerias;
  const feriasMensal = netFerias / 12;

  return {
    gross: sal,
    net: netSalary + totalBenefits,
    benefits: totalBenefits,
    inss,
    irpf,
    fgts,
    decimoTerceiro: decimoTerceiroMensal,
    ferias: feriasMensal,
    totalPackage: netSalary + totalBenefits + fgts + decimoTerceiroMensal + feriasMensal
  };
};

export const calculatePJ = (pjRate, hoursPerMonth, regime = 'simples', faturamento12Meses = 0) => {
  const rate = parseFloat(pjRate) || 0;
  const hours = parseFloat(hoursPerMonth) || 0;
  const monthlyGross = rate * hours;

  let pjTax = 0;
  let taxName = '';
  let isInvalidMEI = false;
  let proLabore = 0;
  let inssPatronal = 0;

  if (regime === 'mei') {
    const rulesMei = TAX_RULES.simples;
    const faturamentoAnualMEI = Number(faturamento12Meses) > 0 ? Number(faturamento12Meses) : monthlyGross * 12;
    if (faturamentoAnualMEI > rulesMei.meiTetoAnual) isInvalidMEI = true;
    pjTax = rulesMei.meiDasMensal;
    taxName = 'DAS MEI (Fixo)';
    proLabore = 0;
  } else if (regime === 'presumido') {
    const rulesPresumido = TAX_RULES.presumido;
    const basePjTax = monthlyGross * rulesPresumido.taxConsolidatedRate;
    
    // Adicional de IRPJ (Aproximação para serviços de TI)
    const lucroPresumido = monthlyGross * rulesPresumido.presumptionRate;
    let adicionalIRPJ = 0;
    if (lucroPresumido > rulesPresumido.irpjAdditionalLimit) {
      adicionalIRPJ = (lucroPresumido - rulesPresumido.irpjAdditionalLimit) * rulesPresumido.irpjAdditionalRate;
    }
    
    pjTax = basePjTax + adicionalIRPJ;
    // Pró-labore mínimo utilizado para fins de simplificação do fluxo comparativo
    proLabore = TAX_RULES.salaryMinimum;
    inssPatronal = proLabore * rulesPresumido.inssPatronalRate;
    const taxPctLabel = (rulesPresumido.taxConsolidatedRate * 100).toFixed(2).replace('.', ',');
    taxName = `Impostos L. Presumido (${taxPctLabel}%${adicionalIRPJ > 0 ? ' + Adic. IRPJ' : ''})`;
  } else {
    // Simples Nacional Anexo III
    const rbt12 = Number(faturamento12Meses) > 0 ? Number(faturamento12Meses) : monthlyGross * 12;
    const simplesRules = TAX_RULES.simples;
    
    let aliquotaNominal = 0;
    let deducao = 0;
    
    for (const band of simplesRules.anexo3Bands) {
      if (rbt12 <= band.limit) {
        aliquotaNominal = band.rate;
        deducao = band.deduction;
        break;
      }
    }
    
    const aliquotaEfetiva = rbt12 > 0 ? (rbt12 * aliquotaNominal - deducao) / rbt12 : simplesRules.anexo3Bands[0].rate;
    
    // Regra extrema precisão: Se RBT12 > sublimite do Simples Nacional, o ISS (5%) é cobrado por fora
    const issSeparado = rbt12 > simplesRules.issSeparadoLimit ? monthlyGross * 0.05 : 0;
    pjTax = (monthlyGross * aliquotaEfetiva) + issSeparado;
    
    // Fator R Otimizado: 28% do faturamento ou salário mínimo
    proLabore = Math.max(TAX_RULES.salaryMinimum, monthlyGross * 0.28);
    const aliqPct = (aliquotaEfetiva * 100).toFixed(2).replace('.', ',');
    taxName = `DAS Simples (${aliqPct}%)${issSeparado > 0 ? ' + ISS 5%' : ''}`;
  }

  let inssSocio = 0;
  let irpfSocio = 0;
  if (proLabore > 0) {
    inssSocio = Math.min(proLabore, TAX_RULES.inss.ceiling) * 0.11;
    // Aproximação utilizando tabela mensal do IRPF
    irpfSocio = calculateIRPF(proLabore);
  }

  // Fluxo de caixa e Dividendos
  const dividendGross = monthlyGross - pjTax - inssPatronal - proLabore;
  let dividendTax = 0;
  
  // Simplificação comparativa da Lei 15.270/2025: 10% de IRRF sobre a totalidade caso as distribuições mensais de lucro superem R$ 50.000
  const dividendRule = TAX_RULES.law15270;
  if (dividendGross > dividendRule.dividendTaxLimit) {
    dividendTax = dividendGross * dividendRule.dividendTaxRate;
  }
  
  const dividendNet = dividendGross - dividendTax;
  const proLaboreNet = proLabore - inssSocio - irpfSocio;
  const netMonthly = dividendNet + proLaboreNet;
  const totalTaxes = pjTax + inssPatronal + inssSocio + irpfSocio + dividendTax;

  return {
    gross: monthlyGross,
    net: netMonthly,
    simplesDAS: pjTax,
    inssProLabore: inssSocio,
    irpfProLabore: irpfSocio,
    inssPatronal,
    dividendTax,
    totalTaxes,
    taxName,
    isInvalidMEI
  };
};
