import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleAuth, OAuth2Client } from 'google-auth-library';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load .env.local
const envContent = fs.readFileSync(path.join(rootDir, '.env.local'), 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.slice(1, -1);
    }
    env[match[1].trim()] = val.replace(/\\n/g, '\n');
  }
});

const GA4_PROPERTY_ID = env.GA4_PROPERTY_ID;
const GA4_CLIENT_EMAIL = env.GA4_CLIENT_EMAIL;
const GA4_PRIVATE_KEY = env.GA4_PRIVATE_KEY;

const CLIENT_ID = env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = env.GOOGLE_CLIENT_SECRET;
const REFRESH_TOKEN = env.GSC_REFRESH_TOKEN;
const SITE_URL = env.GSC_SITE_URL || 'https://calculadora-cltvspj.vercel.app/';

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

async function runGAReport(accessToken, body) {
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

async function getGSCAccessToken() {
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

async function main() {
  console.log('=== ANALYTICS & RELEVANCE REPORT ===\n');

  // 1. GA4
  console.log('--- Consultando GA4 ---');
  try {
    const gaToken = await getGAAuthToken();

    // 30 days KPIs
    const ga30Days = await runGAReport(gaToken, {
      dateRanges: [
        { startDate: '30daysAgo', endDate: 'today', name: 'current_30d' },
        { startDate: '60daysAgo', endDate: '31daysAgo', name: 'previous_30d' }
      ],
      metrics: [
        { name: 'activeUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
        { name: 'bounceRate' },
        { name: 'averageSessionDuration' },
        { name: 'newUsers' },
      ],
    });

    console.log('GA4 Últimos 30 dias vs 30 dias anteriores:');
    if (ga30Days.rows) {
      ga30Days.rows.forEach(r => {
        console.log(`Range: ${r.dimensionValues?.[0]?.value || 'default'} -> Users: ${r.metricValues[0].value}, Sessions: ${r.metricValues[1].value}, PageViews: ${r.metricValues[2].value}, BounceRate: ${(parseFloat(r.metricValues[3].value)*100).toFixed(1)}%, AvgDuration: ${parseFloat(r.metricValues[4].value).toFixed(0)}s, NewUsers: ${r.metricValues[5].value}`);
      });
    }

    // Monthly breakdown (last 90 days or by month)
    const gaMonthly = await runGAReport(gaToken, {
      dateRanges: [{ startDate: '90daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'yearMonth' }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
      ],
      orderBys: [{ dimension: { dimensionName: 'yearMonth' } }],
    });
    console.log('\nGA4 Histórico Mensal (últimos 90 dias):');
    gaMonthly.rows?.forEach(r => {
      console.log(`Mês: ${r.dimensionValues[0].value} -> Usuários: ${r.metricValues[0].value}, Sessões: ${r.metricValues[1].value}, Pageviews: ${r.metricValues[2].value}`);
    });

    // Traffic sources
    const gaSources = await runGAReport(gaToken, {
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'sessionDefaultChannelGroup' }],
      metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    });
    console.log('\nGA4 Fontes de Tráfego (últimos 30 dias):');
    gaSources.rows?.forEach(r => {
      console.log(`Canal: ${r.dimensionValues[0].value} -> Sessões: ${r.metricValues[0].value}, Usuários: ${r.metricValues[1].value}`);
    });

    // Top Pages
    const gaPages = await runGAReport(gaToken, {
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }, { name: 'activeUsers' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 10,
    });
    console.log('\nGA4 Top 10 Páginas (últimos 30 dias):');
    gaPages.rows?.forEach(r => {
      console.log(`Página: ${r.dimensionValues[0].value} -> Pageviews: ${r.metricValues[0].value}, Usuários: ${r.metricValues[1].value}`);
    });

  } catch (err) {
    console.error('Erro no GA4:', err.message);
  }

  // 2. GSC
  console.log('\n--- Consultando Google Search Console ---');
  try {
    const gscToken = await getGSCAccessToken();

    function getDateStr(daysAgo) {
      const d = new Date();
      d.setDate(d.getDate() - daysAgo);
      return d.toISOString().slice(0, 10);
    }

    const end = getDateStr(3);
    const start = getDateStr(3 + 28);
    const prevEnd = getDateStr(3 + 29);
    const prevStart = getDateStr(3 + 57);

    console.log(`Período Atual: ${start} até ${end}`);
    console.log(`Período Anterior: ${prevStart} até ${prevEnd}`);

    const [curOverview, prevOverview] = await Promise.all([
      gscQuery(gscToken, { startDate: start, endDate: end, type: 'web' }),
      gscQuery(gscToken, { startDate: prevStart, endDate: prevEnd, type: 'web' })
    ]);

    const cur = curOverview.rows?.[0] || { clicks: 0, impressions: 0, ctr: 0, position: 0 };
    const prev = prevOverview.rows?.[0] || { clicks: 0, impressions: 0, ctr: 0, position: 0 };

    console.log('\nGSC Visão Geral (Últimos 28 dias vs 28 dias anteriores):');
    console.log(`Cliques: Atual = ${Math.round(cur.clicks)}, Anterior = ${Math.round(prev.clicks)} (${(((cur.clicks - prev.clicks)/Math.max(1, prev.clicks))*100).toFixed(1)}%)`);
    console.log(`Impressões: Atual = ${Math.round(cur.impressions)}, Anterior = ${Math.round(prev.impressions)} (${(((cur.impressions - prev.impressions)/Math.max(1, prev.impressions))*100).toFixed(1)}%)`);
    console.log(`CTR Médio: Atual = ${(cur.ctr * 100).toFixed(2)}%, Anterior = ${(prev.ctr * 100).toFixed(2)}%`);
    console.log(`Posição Média: Atual = ${cur.position.toFixed(1)}, Anterior = ${prev.position.toFixed(1)}`);

    // GSC 3 months / 6 months comparison
    const start3m = getDateStr(3 + 90);
    const prevStart3m = getDateStr(3 + 180);
    const prevEnd3m = getDateStr(3 + 91);

    const [cur3m, prev3m] = await Promise.all([
      gscQuery(gscToken, { startDate: start3m, endDate: end, type: 'web' }),
      gscQuery(gscToken, { startDate: prevStart3m, endDate: prevEnd3m, type: 'web' })
    ]);
    const c3 = cur3m.rows?.[0] || { clicks: 0, impressions: 0, ctr: 0, position: 0 };
    const p3 = prev3m.rows?.[0] || { clicks: 0, impressions: 0, ctr: 0, position: 0 };

    console.log('\nGSC Visão Geral (Últimos 90 dias vs 90 dias anteriores):');
    console.log(`Cliques: Atual = ${Math.round(c3.clicks)}, Anterior = ${Math.round(p3.clicks)} (${(((c3.clicks - p3.clicks)/Math.max(1, p3.clicks))*100).toFixed(1)}%)`);
    console.log(`Impressões: Atual = ${Math.round(c3.impressions)}, Anterior = ${Math.round(p3.impressions)} (${(((c3.impressions - p3.impressions)/Math.max(1, p3.impressions))*100).toFixed(1)}%)`);
    console.log(`Posição Média: Atual = ${c3.position.toFixed(1)}, Anterior = ${p3.position.toFixed(1)}`);

    // Top Queries
    const queriesRes = await gscQuery(gscToken, {
      startDate: start,
      endDate: end,
      type: 'web',
      dimensions: ['query'],
      rowLimit: 25,
      orderBys: [{ fieldName: 'impressions', sortOrder: 'DESCENDING' }],
    });

    console.log('\nGSC Top 20 Palavras-Chave / Consultas (últimos 28 dias):');
    queriesRes.rows?.slice(0, 20).forEach((r, idx) => {
      console.log(`${idx+1}. "${r.keys[0]}" -> Cliques: ${r.clicks}, Impressões: ${r.impressions}, CTR: ${(r.ctr*100).toFixed(1)}%, Posição: ${r.position.toFixed(1)}`);
    });

    // Top Pages
    const pagesRes = await gscQuery(gscToken, {
      startDate: start,
      endDate: end,
      type: 'web',
      dimensions: ['page'],
      rowLimit: 20,
      orderBys: [{ fieldName: 'impressions', sortOrder: 'DESCENDING' }],
    });

    console.log('\nGSC Top Páginas no Google (últimos 28 dias):');
    pagesRes.rows?.slice(0, 15).forEach((r, idx) => {
      const pathOnly = r.keys[0].replace(/^https?:\/\/[^/]+/, '') || '/';
      console.log(`${idx+1}. ${pathOnly} -> Cliques: ${r.clicks}, Impressões: ${r.impressions}, CTR: ${(r.ctr*100).toFixed(1)}%, Posição: ${r.position.toFixed(1)}`);
    });

  } catch (err) {
    console.error('Erro no GSC:', err.message);
  }
}

main();
