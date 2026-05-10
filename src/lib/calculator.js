export const calculateINSS = (sal) => {
  const bands = [
    { limit: 1518.00, rate: 0.075 },
    { limit: 2793.88, rate: 0.09 },
    { limit: 4190.83, rate: 0.12 },
    { limit: 8157.41, rate: 0.14 },
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
  if (baseCalculo <= 5000) {
    return 0;
  }
  if (baseCalculo <= 7350) {
    const reducao = irTradicional * ((7350 - baseCalculo) / 2350);
    return Math.max(0, irTradicional - reducao);
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
  const ferias = sal / 12;

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

export const calculatePJ = (pjRate, hoursPerMonth) => {
  const rate = parseFloat(pjRate) || 0;
  const hours = parseFloat(hoursPerMonth) || 0;
  const monthlyGross = rate * hours;

  // DAS Simples Nacional Anexo III (6%)
  const simplesDAS = monthlyGross * 0.06;
  // INSS sobre pró-labore mínimo
  const inssProLabore = Math.min(monthlyGross, 1518.00) * 0.11;

  const totalTaxes = simplesDAS + inssProLabore;
  const netMonthly = monthlyGross - totalTaxes;

  return {
    gross: monthlyGross,
    net: netMonthly,
    simplesDAS,
    inssProLabore,
    totalTaxes
  };
};
