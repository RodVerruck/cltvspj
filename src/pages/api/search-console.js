/**
 * API Route: /api/search-console
 * Busca dados de performance do Google Search Console via OAuth refresh token.
 *
 * Setup: execute `node scripts/setup-gsc.mjs` para configurar as credenciais.
 */

import { OAuth2Client } from 'google-auth-library';
import { validateToken } from './admin-auth';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GSC_REFRESH_TOKEN;
const SITE_URL = process.env.GSC_SITE_URL || 'https://calculadora-cltvspj.vercel.app/';

async function getAccessToken() {
  const client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, 'http://localhost:3001/callback');
  client.setCredentials({ refresh_token: REFRESH_TOKEN });
  const { token } = await client.getAccessToken();
  return token;
}

async function gscQuery(accessToken, body) {
  const encodedSite = encodeURIComponent(SITE_URL);
  const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodedSite}/searchAnalytics/query`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GSC API ${res.status}: ${text.slice(0, 300)}`);
  }

  return res.json();
}

function getDateStr(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  // Valida token admin
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  if (!validateToken(token)) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  // Verifica configuração
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    return res.status(200).json({
      configured: false,
      message: 'Search Console não configurado. Execute: node scripts/setup-gsc.mjs',
    });
  }

  try {
    const accessToken = await getAccessToken();

    // Datas dos períodos
    const end = getDateStr(0);
    const start = getDateStr(28);
    const prevEnd = getDateStr(29);
    const prevStart = getDateStr(57);

    // 5 consultas paralelas
    const [overallCur, overallPrev, queriesData, pagesData, dailyData] = await Promise.all([
      // KPIs — período atual (28 dias)
      gscQuery(accessToken, { startDate: start, endDate: end, type: 'web' }),
      // KPIs — período anterior (28 dias)
      gscQuery(accessToken, { startDate: prevStart, endDate: prevEnd, type: 'web' }),
      // Top queries
      gscQuery(accessToken, {
        startDate: start, endDate: end, type: 'web',
        dimensions: ['query'], rowLimit: 10,
      }),
      // Top pages
      gscQuery(accessToken, {
        startDate: start, endDate: end, type: 'web',
        dimensions: ['page'], rowLimit: 10,
      }),
      // Tendência diária
      gscQuery(accessToken, {
        startDate: start, endDate: end, type: 'web',
        dimensions: ['date'], rowLimit: 30,
        orderBys: [{ fieldName: 'date', sortOrder: 'ASCENDING' }],
      }),
    ]);

    // Processa KPIs
    const cur = overallCur.rows?.[0] ?? { clicks: 0, impressions: 0, ctr: 0, position: 0 };
    const prev = overallPrev.rows?.[0] ?? { clicks: 0, impressions: 0, ctr: 0, position: 0 };

    const kpis = {
      clicks: Math.round(cur.clicks ?? 0),
      impressions: Math.round(cur.impressions ?? 0),
      ctr: parseFloat(((cur.ctr ?? 0) * 100).toFixed(2)),
      position: parseFloat((cur.position ?? 0).toFixed(1)),
    };

    const comparison = {
      clicks: { current: Math.round(cur.clicks ?? 0), previous: Math.round(prev.clicks ?? 0) },
      impressions: { current: Math.round(cur.impressions ?? 0), previous: Math.round(prev.impressions ?? 0) },
      ctr: {
        current: parseFloat(((cur.ctr ?? 0) * 100).toFixed(2)),
        previous: parseFloat(((prev.ctr ?? 0) * 100).toFixed(2)),
      },
      position: {
        current: parseFloat((cur.position ?? 0).toFixed(1)),
        previous: parseFloat((prev.position ?? 0).toFixed(1)),
      },
    };

    const queries = (queriesData.rows ?? []).map((row) => ({
      query: row.keys[0],
      clicks: Math.round(row.clicks),
      impressions: Math.round(row.impressions),
      ctr: parseFloat((row.ctr * 100).toFixed(2)),
      position: parseFloat(row.position.toFixed(1)),
    }));

    const pages = (pagesData.rows ?? []).map((row) => ({
      page: row.keys[0].replace(/^https?:\/\/[^/]+/, '') || '/',
      clicks: Math.round(row.clicks),
      impressions: Math.round(row.impressions),
      ctr: parseFloat((row.ctr * 100).toFixed(2)),
      position: parseFloat(row.position.toFixed(1)),
    }));

    const daily = (dailyData.rows ?? []).map((row) => ({
      date: row.keys[0],
      clicks: Math.round(row.clicks),
      impressions: Math.round(row.impressions),
    }));

    return res.status(200).json({
      configured: true,
      siteUrl: SITE_URL,
      period: { start, end },
      kpis,
      comparison,
      queries,
      pages,
      daily,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Erro ao buscar Search Console:', err);
    return res.status(500).json({ error: err.message });
  }
}
