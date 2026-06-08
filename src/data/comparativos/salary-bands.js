/** Faixas CLT com saltos inteligentes — evita páginas a cada R$ 100 (thin content). */
export const CLT_SALARY_STEPS = [
  3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500, 7000, 7500, 8000,
  9000, 10000, 11000, 12000, 15000, 18000, 20000, 22000, 25000, 28000, 30000,
];

export const SALARY_BANDS = CLT_SALARY_STEPS.map((cltGross) => ({
  slug: `clt-${cltGross}-vs-pj`,
  type: 'salary-band',
  cltGross,
  pjMultiplier: 1.5,
  hoursPerMonth: 160,
  date: '2026-06-08',
  tags: ['comparativo', 'clt vs pj', `clt ${cltGross}`, '2026'],
}));
