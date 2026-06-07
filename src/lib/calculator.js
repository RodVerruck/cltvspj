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

export function aplicarRedutorLei15270(baseCalculo, irTradicional) {
  if (baseCalculo <= 5000.00) {
    return 0;
  }
  if (baseCalculo <= 7350.00) {
    // Formula oficial Lei 15.270/2025: Redução = R$ 978,62 - (0,133145 × baseCalculo)
    const reducao = 978.62 - (0.133145 * baseCalculo);
    const impostoFinal = irTradicional - Math.max(0, reducao);
    return Math.max(0, impostoFinal);
  }
  return irTradicional;
}

export const calculateCLT = (salary, benefits) => {
  const sal = parseFloat(salary) || 0;
  const totalBenefits = Object.values(benefits).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);

  const inss = calculateINSS(sal);
  const irpfBase = sal - inss;
  let irpfTradicional = 0;
  if (irpfBase > 4664.68) irpfTradicional = irpfBase * 0.275 - 896.00;
  else if (irpfBase > 3751.05) irpfTradicional = irpfBase * 0.225 - 662.77;
  else if (irpfBase > 2826.65) irpfTradicional = irpfBase * 0.15 - 381.44;
  else if (irpfBase > 2259.20) irpfTradicional = irpfBase * 0.075 - 169.44;

  const irpf = aplicarRedutorLei15270(irpfBase, Math.max(irpfTradicional, 0));

  const netSalary = sal - inss - irpf;
  const fgts = sal * 0.08;
  const decimoTerceiro = sal / 12;
  // Provisão de férias de 1/12 + 1/3 constitucional = sal / 9
  const ferias = sal / 9;

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

export const calculatePJ = (pjRate, hoursPerMonth, regime = 'simples') => {
  const rate = parseFloat(pjRate) || 0;
  const hours = parseFloat(hoursPerMonth) || 0;
  const monthlyGross = rate * hours;

  let pjTax = 0;
  let inssProLabore = 0;
  let taxName = 'DAS Simples Nacional (6%)';
  let isInvalidMEI = false;

  if (regime === 'mei') {
    // Teto mensal do MEI em 2026: R$ 6.750,00
    if (monthlyGross > 6750.00) {
      isInvalidMEI = true;
    }
    // DAS MEI 2026: INSS (5% de R$ 1621) + ISS (R$ 5) = R$ 86,05
    pjTax = 86.05;
    inssProLabore = 0;
    taxName = 'DAS MEI (Fixo)';
  } else if (regime === 'presumido') {
    // Lucro Presumido para TI/Serviços 2026:
    // IRPJ: 32% (presunção) × 15% = 4,80%
    // CSLL: 32% (presunção) × 9% = 2,88%
    // PIS: 0,65% (cumulativo)
    // COFINS: 3,00% (cumulativo)
    // ISS: ~3,00% (média municipal para serviços de TI)
    // Total consolidado: ~14,33% → arredondado para 14,5%
    pjTax = monthlyGross * 0.145;
    // INSS pró-labore no Lucro Presumido: 11% (apenas quota retida do sócio)
    // OBS: Os 20% patronais são custo da empresa, não do sócio individual
    inssProLabore = Math.min(monthlyGross, 1621.00) * 0.11;
    taxName = 'Impostos Lucro Presumido (14,5%)';
  } else {
    // Simples Nacional Anexo III (6% de DAS)
    pjTax = monthlyGross * 0.06;
    // INSS pró-labore mínimo no Simples (11% de R$ 1621) = R$ 178,31
    inssProLabore = Math.min(monthlyGross, 1621.00) * 0.11;
    taxName = 'DAS Simples Nacional (6%)';
  }

  const totalTaxes = pjTax + inssProLabore;
  const netMonthly = monthlyGross - totalTaxes;

  return {
    gross: monthlyGross,
    net: netMonthly,
    simplesDAS: pjTax,
    inssProLabore,
    totalTaxes,
    taxName,
    isInvalidMEI
  };
};
