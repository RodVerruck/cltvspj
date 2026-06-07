export const calculateINSS = (sal) => {
  const bands = [
    { limit: 1621.00, rate: 0.075 },
    { limit: 2902.84, rate: 0.09 },
    { limit: 4354.27, rate: 0.12 },
    { limit: 8475.55, rate: 0.14 },
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

export function aplicarRedutorLei15270(rendimentoTributavel, irTradicional) {
  if (rendimentoTributavel <= 5000.00) {
    return 0;
  }
  if (rendimentoTributavel <= 7350.00) {
    // Formula oficial Lei 15.270/2025: Redução = R$ 978,62 - (0,133145 × rendimentoTributavel)
    const reducao = 978.62 - (0.133145 * rendimentoTributavel);
    const impostoFinal = irTradicional - Math.max(0, reducao);
    return Math.max(0, impostoFinal);
  }
  return irTradicional;
}

const calculateIRPFForBase = (irpfBase, grossAmount) => {
  let irpfTradicional = 0;
  if (irpfBase > 4664.68) {
    irpfTradicional = irpfBase * 0.275 - 908.73;
  } else if (irpfBase > 3751.05) {
    irpfTradicional = irpfBase * 0.225 - 675.49;
  } else if (irpfBase > 2826.65) {
    irpfTradicional = irpfBase * 0.15 - 394.16;
  } else if (irpfBase > 2428.80) {
    irpfTradicional = irpfBase * 0.075 - 182.16;
  }
  
  return aplicarRedutorLei15270(grossAmount, Math.max(irpfTradicional, 0));
};

const calculateIRPF = (grossAmount) => {
  const inss = calculateINSS(grossAmount);
  
  // Opção A: Deduções Legais (neste caso, apenas INSS do funcionário)
  const baseDeducoesLegais = Math.max(0, grossAmount - inss);
  const irpfDeducoesLegais = calculateIRPFForBase(baseDeducoesLegais, grossAmount);
  
  // Opção B: Desconto Simplificado (R$ 607,20 fixo)
  const baseDescontoSimplificado = Math.max(0, grossAmount - 607.20);
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
    const faturamentoAnualMEI = Number(faturamento12Meses) > 0 ? Number(faturamento12Meses) : monthlyGross * 12;
    if (faturamentoAnualMEI > 81000.00) isInvalidMEI = true;
    pjTax = 86.05;
    taxName = 'DAS MEI (Fixo)';
    proLabore = 0;
  } else if (regime === 'presumido') {
    // Lucro Presumido TI/Serviços 2026: Carga base estimada = 14,33% (IRPJ 4.8%, CSLL 2.88%, PIS 0.65%, COFINS 3%, ISS 3%)
    const basePjTax = monthlyGross * 0.1433;
    
    // Adicional de IRPJ (Aproximação para serviços de TI): 10% sobre a parcela do lucro presumido (32%) que excede R$ 20.000 mensais
    const lucroPresumido = monthlyGross * 0.32;
    let adicionalIRPJ = 0;
    if (lucroPresumido > 20000) {
      adicionalIRPJ = (lucroPresumido - 20000) * 0.10;
    }
    
    pjTax = basePjTax + adicionalIRPJ;
    proLabore = 1621.00;
    inssPatronal = proLabore * 0.20;
    taxName = `Impostos L. Presumido (14,33%${adicionalIRPJ > 0 ? ' + Adic. IRPJ' : ''})`;
  } else {
    // Simples Nacional Anexo III
    const rbt12 = Number(faturamento12Meses) > 0 ? Number(faturamento12Meses) : monthlyGross * 12;
    let aliquotaNominal = 0;
    let deducao = 0;
    if (rbt12 <= 180000) { aliquotaNominal = 0.06; deducao = 0; }
    else if (rbt12 <= 360000) { aliquotaNominal = 0.112; deducao = 9360; }
    else if (rbt12 <= 720000) { aliquotaNominal = 0.135; deducao = 17640; }
    else if (rbt12 <= 1800000) { aliquotaNominal = 0.16; deducao = 35640; }
    else if (rbt12 <= 3600000) { aliquotaNominal = 0.21; deducao = 125640; }
    else { aliquotaNominal = 0.33; deducao = 648000; }
    
    const aliquotaEfetiva = rbt12 > 0 ? (rbt12 * aliquotaNominal - deducao) / rbt12 : 0.06;
    
    // Regra extrema precisão: Se RBT12 > 3.6 milhões, o ISS (5%) é cobrado por fora do DAS no Anexo III
    const issSeparado = rbt12 > 3600000 ? monthlyGross * 0.05 : 0;
    pjTax = (monthlyGross * aliquotaEfetiva) + issSeparado;
    
    // Fator R Otimizado: 28% do faturamento ou salário mínimo
    proLabore = Math.max(1621.00, monthlyGross * 0.28);
    const aliqPct = (aliquotaEfetiva * 100).toFixed(2).replace('.', ',');
    taxName = `DAS Simples (${aliqPct}%)${issSeparado > 0 ? ' + ISS 5%' : ''}`;
  }

  let inssSocio = 0;
  let irpfSocio = 0;
  if (proLabore > 0) {
    inssSocio = Math.min(proLabore, 8475.55) * 0.11;
    irpfSocio = calculateIRPF(proLabore); // IRPF sobre o pró-labore
  }

  // Fluxo de caixa e Dividendos
  const dividendGross = monthlyGross - pjTax - inssPatronal - proLabore;
  let dividendTax = 0;
  // Simplificação comparativa da Lei 15.270/2025: 10% de IRRF sobre a totalidade caso as distribuições mensais de lucro superem R$ 50.000
  if (dividendGross > 50000) {
    dividendTax = dividendGross * 0.10;
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
