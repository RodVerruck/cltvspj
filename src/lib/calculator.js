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
  if (sal === 0) return { gross: 0, net: 0, benefits: 0, inss: 0, irpf: 0, fgts: 0, decimoTerceiro: 0, ferias: 0, plr: 0, totalPackage: 0 };

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
    totalPackage: netSalary + totalBenefits + fgts + decimoTerceiroMensal + feriasMensal + plrMensal
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
  pensaoAlimenticia = 0
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
    // O IRPF sobre o pró-labore herda os dependentes e a pensão judicial
    irpfSocio = calculateIRPF(proLabore, dependentes, pensaoAlimenticia);
  }

  // Fluxo de caixa e Dividendos
  const dividendGross = monthlyGross - pjTax - inssPatronal - proLabore;
  const dividendTax = 0; // Isenção de dividendos integral sob as regras do ano vigente
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
    isInvalidMEI,
    proLabore,
    // Variáveis detalhadas do Lucro Presumido
    lpIRPJ,
    lpCSLL,
    lpPIS,
    lpCOFINS,
    lpISS,
    lpAdicionalIRPJ
  };
};
