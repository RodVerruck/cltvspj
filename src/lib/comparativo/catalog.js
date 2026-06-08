import { SALARY_BANDS } from '../../data/comparativos/salary-bands';
import { CASE_STUDIES } from '../../data/comparativos/case-studies';
import { buildComparativoScenario } from './scenario';

const RAW_CATALOG = [...SALARY_BANDS, ...CASE_STUDIES];

export function getAllComparativoConfigs() {
  return RAW_CATALOG;
}

export function getAllComparativos() {
  return RAW_CATALOG.map(buildComparativoScenario);
}

export function getComparativoBySlug(slug) {
  const config = RAW_CATALOG.find((item) => item.slug === slug);
  if (!config) return null;
  return buildComparativoScenario(config);
}

export function getRelatedComparativos(slug, limit = 4) {
  const current = RAW_CATALOG.find((item) => item.slug === slug);
  if (!current) return getAllComparativos().slice(0, limit);

  const sameType = RAW_CATALOG.filter(
    (item) => item.slug !== slug && item.type === current.type,
  );

  const picked = sameType.slice(0, limit).map(buildComparativoScenario);
  if (picked.length >= limit) return picked;

  const rest = RAW_CATALOG.filter(
    (item) => item.slug !== slug && !picked.find((p) => p.slug === item.slug),
  )
    .slice(0, limit - picked.length)
    .map(buildComparativoScenario);

  return [...picked, ...rest];
}
