/** Faixas salariais CLT — cauda longa. PJ = CLT × multiplier (proposta típica TI). */
const AMOUNTS = [3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000];

export const SALARY_BANDS = AMOUNTS.map((cltGross) => ({
  slug: `clt-${cltGross}-vs-pj`,
  type: 'salary-band',
  cltGross,
  pjMultiplier: 1.5,
  hoursPerMonth: 160,
  date: '2026-06-08',
  tags: ['comparativo', 'clt vs pj', `clt ${cltGross}`, '2026'],
}));
