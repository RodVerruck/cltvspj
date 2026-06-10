/**
 * API Route: /api/search-console
 * Busca dados de performance do Google Search Console via OAuth refresh token.
 */

import { OAuth2Client } from 'google-auth-library';
import { validateToken } from './admin-auth';
import {
  mapGscRow,
  computePositionDistribution,
  computeStrikingDistance,
  computePageTypes,
  computeInsights,
  formatSiteHostname,
} from '../../lib/search-console/transform';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GSC_REFRESH_TOKEN;
const SITE_URL = process.env.GSC_SITE_URL || 'https://calculadora-cltvspj.vercel.app/';

/** GSC costuma ter atraso de 2–3 dias nos dados consolidados. */
const GSC_DATA_LAG_DAYS = 3;

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

function mapQueryRows(rows = []) {
  return rows.map((row) => {
    const mapped = mapGscRow(row, 0);
    return { query: mapped.key, ...mapped };
  });
}

function mapPageRows(rows = []) {
  return rows.map((row) => {
    const fullUrl = row.keys[0];
    const path = fullUrl.replace(/^https?:\/\/[^/]+/, '') || '/';
    const mapped = mapGscRow(row, 0);
    return { page: path, fullUrl, ...mapped };
  });
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const token = (req.headers.authorization || '').replace('Bearer ', '');
  if (!validateToken(token)) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    return res.status(200).json({
      configured: false,
      message: 'Search Console não configurado. Execute: node scripts/setup-gsc.mjs',
    });
  }

  try {
    const accessToken = await getAccessToken();

    const end = getDateStr(GSC_DATA_LAG_DAYS);
    const start = getDateStr(GSC_DATA_LAG_DAYS + 28);
    const prevEnd = getDateStr(GSC_DATA_LAG_DAYS + 29);
    const prevStart = getDateStr(GSC_DATA_LAG_DAYS + 57);

    const [
      overallCur,
      overallPrev,
      queriesData,
      pagesData,
      dailyData,
      devicesData,
    ] = await Promise.all([
      gscQuery(accessToken, { startDate: start, endDate: end, type: 'web' }),
      gscQuery(accessToken, { startDate: prevStart, endDate: prevEnd, type: 'web' }),
      gscQuery(accessToken, {
        startDate: start,
        endDate: end,
        type: 'web',
        dimensions: ['query'],
        rowLimit: 50,
        orderBys: [{ fieldName: 'impressions', sortOrder: 'DESCENDING' }],
      }),
      gscQuery(accessToken, {
        startDate: start,
        endDate: end,
        type: 'web',
        dimensions: ['page'],
        rowLimit: 25,
        orderBys: [{ fieldName: 'impressions', sortOrder: 'DESCENDING' }],
      }),
      gscQuery(accessToken, {
        startDate: start,
        endDate: end,
        type: 'web',
        dimensions: ['date'],
        rowLimit: 31,
        orderBys: [{ fieldName: 'date', sortOrder: 'ASCENDING' }],
      }),
      gscQuery(accessToken, {
        startDate: start,
        endDate: end,
        type: 'web',
        dimensions: ['device'],
        rowLimit: 5,
        orderBys: [{ fieldName: 'impressions', sortOrder: 'DESCENDING' }],
      }),
    ]);

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

    const queries = mapQueryRows(queriesData.rows);
    const pages = mapPageRows(pagesData.rows);

    const daily = (dailyData.rows ?? []).map((row) => ({
      date: row.keys[0],
      clicks: Math.round(row.clicks),
      impressions: Math.round(row.impressions),
      ctr: parseFloat((row.ctr * 100).toFixed(2)),
      position: parseFloat(row.position.toFixed(1)),
    }));

    const devices = (devicesData.rows ?? []).map((row) => {
      const mapped = mapGscRow(row, 0);
      const deviceKey = mapped.key.toLowerCase();
      const labels = { desktop: 'Desktop', mobile: 'Mobile', tablet: 'Tablet' };
      return {
        device: deviceKey,
        label: labels[deviceKey] || mapped.key,
        ...mapped,
      };
    });

    const strikingDistance = computeStrikingDistance(queries);
    const positionDistribution = computePositionDistribution(queries);
    const pageTypes = computePageTypes(pages);
    const period = { start, end, lagDays: GSC_DATA_LAG_DAYS };

    const { insights, actions, meta } = computeInsights({
      kpis,
      comparison,
      queries,
      pages,
      strikingDistance,
      period,
    });

    return res.status(200).json({
      configured: true,
      siteUrl: SITE_URL,
      siteHost: formatSiteHostname(SITE_URL),
      period,
      kpis,
      comparison,
      queries,
      pages,
      daily,
      devices,
      strikingDistance,
      positionDistribution,
      pageTypes,
      insights,
      actions,
      meta,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Erro ao buscar Search Console:', err);
    return res.status(500).json({ error: err.message });
  }
}
