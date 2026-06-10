/** Processamento e insights para o dashboard SEO (Search Console). */

export function mapGscRow(row, keyIndex = 0) {
  return {
    key: row.keys?.[keyIndex] ?? '',
    clicks: Math.round(row.clicks ?? 0),
    impressions: Math.round(row.impressions ?? 0),
    ctr: parseFloat(((row.ctr ?? 0) * 100).toFixed(2)),
    position: parseFloat((row.position ?? 0).toFixed(1)),
  };
}

export function categorizePage(path) {
  if (!path || path === '/') return { type: 'home', label: 'Calculadora', color: '#4ade80' };
  if (path.startsWith('/blog/comparativo/')) return { type: 'comparativo', label: 'Comparativo', color: '#a78bfa' };
  if (path.startsWith('/blog/comparativos')) return { type: 'hub', label: 'Hub', color: '#c084fc' };
  if (path.startsWith('/blog/')) return { type: 'blog', label: 'Artigo', color: '#60a5fa' };
  return { type: 'other', label: 'Outra', color: '#6b7280' };
}

export function getPositionTier(position) {
  if (position <= 3) return { id: 'top3', label: 'Top 3', short: 'Pág. 1', color: '#4ade80', bg: '#4ade8022', priority: 1 };
  if (position <= 10) return { id: 'page1', label: 'Página 1', short: 'Pág. 1', color: '#86efac', bg: '#86efac22', priority: 2 };
  if (position <= 20) return { id: 'page2', label: 'Página 2 · zona de ouro', short: 'Pág. 2', color: '#fbbf24', bg: '#fbbf2422', priority: 3 };
  if (position <= 30) return { id: 'page3', label: 'Página 3 · atacável', short: 'Pág. 3', color: '#fb923c', bg: '#fb923c22', priority: 4 };
  if (position <= 50) return { id: 'mid', label: 'Meio do ranking', short: 'Pág. 4–5', color: '#f87171', bg: '#f8717122', priority: 5 };
  return { id: 'deep', label: 'Long tail', short: 'Pág. 6+', color: '#9ca3af', bg: '#9ca3af22', priority: 6 };
}

export function computePositionDistribution(queries) {
  const buckets = {
    top3: { label: 'Top 3', count: 0, impressions: 0, color: '#4ade80' },
    page1: { label: 'Pos. 4–10', count: 0, impressions: 0, color: '#86efac' },
    page2: { label: 'Pos. 11–20', count: 0, impressions: 0, color: '#fbbf24' },
    page3: { label: 'Pos. 21–30', count: 0, impressions: 0, color: '#fb923c' },
    deep: { label: 'Pos. 31+', count: 0, impressions: 0, color: '#f87171' },
  };

  for (const q of queries) {
    const p = q.position;
    let bucket;
    if (p <= 3) bucket = 'top3';
    else if (p <= 10) bucket = 'page1';
    else if (p <= 20) bucket = 'page2';
    else if (p <= 30) bucket = 'page3';
    else bucket = 'deep';
    buckets[bucket].count += 1;
    buckets[bucket].impressions += q.impressions;
  }

  return Object.entries(buckets).map(([id, data]) => ({ id, ...data }));
}

/** Queries entre posição 11–30 com impressões — prioridade SEO. */
export function computeStrikingDistance(queries, { minPos = 11, maxPos = 30, minImpressions = 1, limit = 15 } = {}) {
  return queries
    .filter((q) => q.position >= minPos && q.position <= maxPos && q.impressions >= minImpressions)
    .sort((a, b) => {
      if (b.impressions !== a.impressions) return b.impressions - a.impressions;
      return a.position - b.position;
    })
    .slice(0, limit)
    .map((q) => ({
      ...q,
      tier: getPositionTier(q.position),
      action: q.position <= 20
        ? 'Reforçar título, FAQ e links internos — perto da página 1'
        : 'Adicionar seção específica e linkar de artigos pilares',
    }));
}

export function computePageTypes(pages) {
  const types = {};
  for (const page of pages) {
    const cat = categorizePage(page.page);
    if (!types[cat.type]) {
      types[cat.type] = { ...cat, impressions: 0, clicks: 0, pages: 0 };
    }
    types[cat.type].impressions += page.impressions;
    types[cat.type].clicks += page.clicks;
    types[cat.type].pages += 1;
  }
  return Object.values(types).sort((a, b) => b.impressions - a.impressions);
}

export function computeInsights({ kpis, comparison, queries, pages, strikingDistance, period }) {
  const insights = [];
  const actions = [];

  const totalQueryImpressions = queries.reduce((s, q) => s + q.impressions, 0);
  const bestQuery = [...queries].sort((a, b) => {
    if (a.position <= 30 && b.position > 30) return -1;
    if (b.position <= 30 && a.position > 30) return 1;
    return b.impressions - a.impressions;
  })[0];

  if (kpis.impressions > 0 && kpis.clicks === 0) {
    insights.push({
      type: 'discovery',
      title: 'Google já está testando o site',
      body: `${kpis.impressions} impressões sem cliques ainda — normal em domínio jovem. O Google exibe; usuários ainda não clicam porque a posição média está baixa (#${kpis.position}).`,
      color: '#60a5fa',
    });
    actions.push('Priorize queries na posição 15–30 em vez de criar dezenas de páginas novas.');
  }

  if (kpis.position > 50) {
    insights.push({
      type: 'position',
      title: 'Posição média alta — não é o KPI principal agora',
      body: `Média #${kpis.position} puxada por muitas queries genéricas. Acompanhe impressões e queries individuais na faixa 11–30.`,
      color: '#fbbf24',
    });
  }

  if (strikingDistance.length > 0) {
    const top = strikingDistance[0];
    insights.push({
      type: 'opportunity',
      title: `${strikingDistance.length} oportunidade(s) na zona 11–30`,
      body: `"${top.query}" — posição #${top.position} com ${top.impressions} impressões. Empurrar para top 10 costuma ser mais rápido que ranquear termos novos.`,
      color: '#4ade80',
    });
    actions.push(`Reforçar conteúdo para: "${top.query}"`);
  }

  if (bestQuery && bestQuery.position <= 50) {
    insights.push({
      type: 'best',
      title: 'Melhor sinal até agora',
      body: `"${bestQuery.query}" — posição #${bestQuery.position}, ${bestQuery.impressions} impressões, ${bestQuery.clicks} cliques.`,
      color: '#a78bfa',
    });
  }

  const impDelta = comparison?.impressions?.previous
    ? ((comparison.impressions.current - comparison.impressions.previous) / comparison.impressions.previous) * 100
    : null;

  if (impDelta !== null && impDelta > 10) {
    insights.push({
      type: 'growth',
      title: 'Impressões crescendo',
      body: `+${impDelta.toFixed(0)}% vs. período anterior (${comparison.impressions.previous} → ${comparison.impressions.current}).`,
      color: '#4ade80',
    });
  }

  const indexedPages = pages.filter((p) => p.impressions > 0).length;
  if (pages.length > 0 && indexedPages <= 2) {
    insights.push({
      type: 'coverage',
      title: 'Poucas páginas recebendo impressões',
      body: `Apenas ${indexedPages} URL(s) aparecem no Google. Envie sitemap, indexe comparativos prioritários (1/dia no GSC) e aguarde digestão.`,
      color: '#fb923c',
    });
    actions.push('Indexar manualmente /blog/comparativos e 3 comparativos de profissão.');
  }

  if (totalQueryImpressions > 0 && queries.length >= 5) {
    const shareTop3 = queries.slice(0, 3).reduce((s, q) => s + q.impressions, 0) / totalQueryImpressions;
    if (shareTop3 > 0.6) {
      insights.push({
        type: 'concentration',
        title: 'Tráfego concentrado em poucas queries',
        body: `${Math.round(shareTop3 * 100)}% das impressões vêm das 3 principais palavras-chave — foque nelas antes de expandir.`,
        color: '#60a5fa',
      });
    }
  }

  return {
    insights: insights.slice(0, 4),
    actions: [...new Set(actions)].slice(0, 4),
    meta: {
      periodLabel: `${formatPeriodDate(period.start)} — ${formatPeriodDate(period.end)}`,
      strikingCount: strikingDistance.length,
      pagesWithImpressions: indexedPages,
      queryCount: queries.length,
    },
  };
}

function formatPeriodDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export function formatSiteHostname(siteUrl) {
  try {
    return new URL(siteUrl).hostname;
  } catch {
    return siteUrl?.replace(/^https?:\/\//, '').replace(/\/$/, '') || '';
  }
}
