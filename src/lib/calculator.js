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
  // Desconto Simplificado 2026: R$ 607,20. Aplica-se se for maior que a dedução do INSS.
  const descontoIrpf = Math.max(inss, 607.20);
  const irpfBase = sal - descontoIrpf;
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
  let taxName = '';
  let isInvalidMEI = false;
  let proLabore = 0;
  let inssPatronal = 0;

  if (regime === 'mei') {
    if (monthlyGross > 6750.00) isInvalidMEI = true;
    pjTax = 86.05;
    taxName = 'DAS MEI (Fixo)';
    proLabore = 0;
  } else if (regime === 'presumido') {
    // Lucro Presumido TI/Serviços 2026: Base exata = 14,33% (IRPJ 4.8%, CSLL 2.88%, PIS 0.65%, COFINS 3%, ISS 3%)
    const basePjTax = monthlyGross * 0.1433;
    
    // Adicional de IRPJ: 10% sobre a parcela do lucro presumido (32%) que excede R$ 20.000 mensais
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
    const rbt12 = monthlyGross * 12;
    let aliquotaNominal = 0;
    let deducao = 0;
    if (rbt12 <= 180000) { aliquotaNominal = 0.06; deducao = 0; }
    else if (rbt12 <= 360000) { aliquotaNominal = 0.112; deducao = 9360; }
    else if (rbt12 <= 720000) { aliquotaNominal = 0.135; deducao = 17640; }
    else if (rbt12 <= 1800000) { aliquotaNominal = 0.16; deducao = 35640; }
    else if (rbt12 <= 3600000) { aliquotaNominal = 0.21; deducao = 125640; }
    else { aliquotaNominal = 0.33; deducao = 648000; }
    
    const aliquotaEfetiva = rbt12 > 0 ? (rbt12 * aliquotaNominal - deducao) / rbt12 : 0.06;
    pjTax = monthlyGross * aliquotaEfetiva;
    proLabore = Math.max(1621.00, monthlyGross * 0.28);
    const aliqPct = (aliquotaEfetiva * 100).toFixed(2).replace('.', ',');
    taxName = `DAS Simples (${aliqPct}%)`;
  }

  let inssSocio = 0;
  let irpfSocio = 0;
  if (proLabore > 0) {
    inssSocio = Math.min(proLabore, 8475.55) * 0.11;
    // Desconto Simplificado 2026: R$ 607,20
    const descontoIrpfSocio = Math.max(inssSocio, 607.20);
    const irpfBase = proLabore - descontoIrpfSocio;
    let irpfTradicional = 0;
    if (irpfBase > 4664.68) irpfTradicional = irpfBase * 0.275 - 896.00;
    else if (irpfBase > 3751.05) irpfTradicional = irpfBase * 0.225 - 662.77;
    else if (irpfBase > 2826.65) irpfTradicional = irpfBase * 0.15 - 381.44;
    else if (irpfBase > 2259.20) irpfTradicional = irpfBase * 0.075 - 169.44;
    irpfSocio = aplicarRedutorLei15270(irpfBase, Math.max(irpfTradicional, 0));
  }

  const dividendGross = monthlyGross - pjTax - inssPatronal - proLabore;
  let dividendTax = 0;
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
