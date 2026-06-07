/**
 * API Route: /api/analytics
 * Busca dados do GA4 Data API via Service Account e retorna para o dashboard admin.
 */

import { GoogleAuth } from 'google-auth-library';
import { validateToken } from './admin-auth';

const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID;
const GA4_CLIENT_EMAIL = process.env.GA4_CLIENT_EMAIL;
const GA4_PRIVATE_KEY = process.env.GA4_PRIVATE_KEY?.replace(/\\n/g, '\n');

async function getGAAuthToken() {
  const auth = new GoogleAuth({
    credentials: {
      client_email: GA4_CLIENT_EMAIL,
      private_key: GA4_PRIVATE_KEY,
    },
    scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
  });

  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  return tokenResponse.token;
}

async function runReport(accessToken, body) {
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runReport`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GA4 API error: ${res.status} — ${err}`);
  }

  return res.json();
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  // Valida token de admin
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  if (!validateToken(token)) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  // Verifica credenciais GA4
  if (!GA4_PROPERTY_ID || !GA4_CLIENT_EMAIL || !GA4_PRIVATE_KEY) {
    return res.status(200).json({
      configured: false,
      message: 'Credenciais GA4 não configuradas. Preencha GA4_PROPERTY_ID, GA4_CLIENT_EMAIL e GA4_PRIVATE_KEY no .env.local',
    });
  }

  try {
    const accessToken = await getGAAuthToken();

    // --- Relatório 1: KPIs gerais dos últimos 30 dias ---
    const kpiReport = await runReport(accessToken, {
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
        { name: 'bounceRate' },
        { name: 'averageSessionDuration' },
        { name: 'newUsers' },
      ],
    });

    // --- Relatório 2: Usuários por dia (últimos 30 dias) ---
    const dailyReport = await runReport(accessToken, {
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'date' }],
      metrics: [{ name: 'activeUsers' }, { name: 'sessions' }],
      orderBys: [{ dimension: { dimensionName: 'date' } }],
    });

    // --- Relatório 3: Top páginas ---
    const pagesReport = await runReport(accessToken, {
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }, { name: 'activeUsers' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 10,
    });

    // --- Relatório 4: Origens de tráfego ---
    const sourcesReport = await runReport(accessToken, {
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'sessionDefaultChannelGroup' }],
      metrics: [{ name: 'sessions' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    });

    // --- Relatório 5: Dispositivos ---
    const devicesReport = await runReport(accessToken, {
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'deviceCategory' }],
      metrics: [{ name: 'sessions' }],
    });

    // --- Relatório 6: Países ---
    const countriesReport = await runReport(accessToken, {
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'country' }],
      metrics: [{ name: 'sessions' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 8,
    });

    // --- Relatório 7: Comparativo últimos 7 dias vs semana anterior ---
    const weekReport = await runReport(accessToken, {
      dateRanges: [
        { startDate: '7daysAgo', endDate: 'today' },
        { startDate: '14daysAgo', endDate: '8daysAgo' },
      ],
      metrics: [{ name: 'activeUsers' }, { name: 'sessions' }, { name: 'screenPageViews' }],
    });

    // --- Processar dados ---
    const kpiRow = kpiReport.rows?.[0]?.metricValues || [];
    const kpis = {
      users: parseInt(kpiRow[0]?.value || 0),
      sessions: parseInt(kpiRow[1]?.value || 0),
      pageviews: parseInt(kpiRow[2]?.value || 0),
      bounceRate: parseFloat((parseFloat(kpiRow[3]?.value || 0) * 100).toFixed(1)),
      avgSessionDuration: parseFloat(parseFloat(kpiRow[4]?.value || 0).toFixed(0)),
      newUsers: parseInt(kpiRow[5]?.value || 0),
    };

    const daily = (dailyReport.rows || []).map((row) => ({
      date: row.dimensionValues[0].value, // YYYYMMDD
      users: parseInt(row.metricValues[0].value),
      sessions: parseInt(row.metricValues[1].value),
    }));

    const pages = (pagesReport.rows || []).map((row) => ({
      path: row.dimensionValues[0].value,
      views: parseInt(row.metricValues[0].value),
      users: parseInt(row.metricValues[1].value),
    }));

    const sources = (sourcesReport.rows || []).map((row) => ({
      channel: row.dimensionValues[0].value,
      sessions: parseInt(row.metricValues[0].value),
    }));

    const devices = (devicesReport.rows || []).map((row) => ({
      device: row.dimensionValues[0].value,
      sessions: parseInt(row.metricValues[0].value),
    }));

    const countries = (countriesReport.rows || []).map((row) => ({
      country: row.dimensionValues[0].value,
      sessions: parseInt(row.metricValues[0].value),
    }));

    // Comparativo semana atual vs anterior
    const weekCurrent = weekReport.rows?.[0];
    const weekPrevious = weekReport.rows?.[1];
    const weekComparison = {
      users: {
        current: parseInt(weekCurrent?.metricValues[0]?.value || 0),
        previous: parseInt(weekPrevious?.metricValues[0]?.value || 0),
      },
      sessions: {
        current: parseInt(weekCurrent?.metricValues[1]?.value || 0),
        previous: parseInt(weekPrevious?.metricValues[1]?.value || 0),
      },
      pageviews: {
        current: parseInt(weekCurrent?.metricValues[2]?.value || 0),
        previous: parseInt(weekPrevious?.metricValues[2]?.value || 0),
      },
    };

    return res.status(200).json({
      configured: true,
      kpis,
      daily,
      pages,
      sources,
      devices,
      countries,
      weekComparison,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Erro ao buscar GA4:', err);
    return res.status(500).json({ error: err.message });
  }
}
