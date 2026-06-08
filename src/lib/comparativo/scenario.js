import { calculateCLT, calculatePJ } from '../calculator';
import { formatBRL, formatBRLShort } from './format';

const DEFAULT_BENEFITS = {
  vr: '600',
  vt: '300',
  planoSaude: '400',
  seguroVida: '50',
};

const DEFAULT_CONTADOR = 350;

function getContextNotes(cltGross, pjGross) {
  const notes = [];

  if (cltGross <= 5000) {
    notes.push(
      'Nesta faixa, a CLT pode se beneficiar da isenção de IRPF até R$ 5.000 (Lei 15.270/2025), o que estreita a vantagem da PJ.',
    );
  }

  if (pjGross > 6750) {
    notes.push(
      'Com faturamento PJ acima de R$ 6.750/mês, MEI não é opção — a simulação usa Simples Nacional.',
    );
  }

  if (cltGross >= 8000) {
    notes.push(
      'Acima de R$ 8.000 CLT, propostas PJ de TI costumam incluir Fator R e Anexo III — vale simular o pró-labore na calculadora completa.',
    );
  }

  return notes;
}

export function buildComparativoScenario(config) {
  const {
    cltGross,
    pjGross: fixedPjGross,
    pjMultiplier = 1.5,
    hoursPerMonth = 160,
    slug,
    type,
  } = config;

  const pjMonthlyGross = fixedPjGross ?? Math.round(cltGross * pjMultiplier);
  const pjRate = pjMonthlyGross / hoursPerMonth;
  const rbt12 = pjMonthlyGross * 12;

  const clt = calculateCLT(cltGross, DEFAULT_BENEFITS);
  const pj = calculatePJ(
    pjRate,
    hoursPerMonth,
    'simples',
    rbt12,
    'minimo',
    '',
    3,
    0,
    0,
    DEFAULT_CONTADOR,
  );

  const diffMonthly = pj.net - clt.totalPackage;
  const diffAnnual = diffMonthly * 12;
  const winner = diffMonthly > 0 ? 'pj' : 'clt';
  const cltLabel = formatBRLShort(cltGross);
  const pjLabel = formatBRLShort(pjMonthlyGross);

  let title;
  let description;
  let seriesLabel;

  if (type === 'case-study') {
    seriesLabel = 'Estudo de caso';
    title = `CLT R$ ${cltLabel} vs PJ R$ ${pjLabel}: Simulação 2026`;
    description = `Compare CLT de R$ ${cltLabel} com PJ de R$ ${pjLabel}/mês. Líquido CLT (pacote total): R$ ${formatBRL(clt.totalPackage)}. Líquido PJ: R$ ${formatBRL(pj.net)}. Diferença: R$ ${formatBRL(Math.abs(diffMonthly))}/mês a favor ${winner === 'pj' ? 'da PJ' : 'da CLT'}.`;
  } else {
    seriesLabel = 'Faixa salarial';
    title = `CLT R$ ${cltLabel} ou PJ: Qual Vale Mais em 2026?`;
    description = `CLT R$ ${cltLabel} vs PJ equivalente (~R$ ${pjLabel}/mês). Simulação com impostos 2026: pacote CLT R$ ${formatBRL(clt.totalPackage)} vs líquido PJ R$ ${formatBRL(pj.net)}. Veja qual compensa no seu caso.`;
  }

  return {
    slug,
    type,
    seriesLabel,
    title,
    description,
    date: config.date || '2026-06-08',
    tags: config.tags || [],
    cltGross,
    pjMonthlyGross,
    pjRate,
    hoursPerMonth,
    clt,
    pj,
    diffMonthly,
    diffAnnual,
    winner,
    contextNotes: getContextNotes(cltGross, pjMonthlyGross),
    readingTime: '4 min',
    author: 'Equipe CLT ou PJ',
  };
}
