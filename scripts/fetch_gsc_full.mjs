import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleAuth } from 'google-auth-library';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

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

const GA4_CLIENT_EMAIL = env.GA4_CLIENT_EMAIL;
const GA4_PRIVATE_KEY = env.GA4_PRIVATE_KEY;
const SITE_URL = env.GSC_SITE_URL || 'https://calculadora-cltvspj.vercel.app/';

async function getAccessToken() {
  const auth = new GoogleAuth({
    credentials: {
      client_email: GA4_CLIENT_EMAIL,
      private_key: GA4_PRIVATE_KEY,
    },
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });
  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  return tokenResponse.token;
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
    throw new Error(`GSC API ${res.status}: ${text}`);
  }
  return res.json();
}

function getDateStr(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

async function main() {
  const token = await getAccessToken();
  const end = getDateStr(3);
  const start = getDateStr(3 + 28);
  const prevEnd = getDateStr(3 + 29);
  const prevStart = getDateStr(3 + 57);

  console.log(`Período Atual: ${start} até ${end}`);

  const [overallCur, overallPrev, queriesData, pagesData, dailyData, devicesData] = await Promise.all([
    gscQuery(token, { startDate: start, endDate: end, type: 'web' }),
    gscQuery(token, { startDate: prevStart, endDate: prevEnd, type: 'web' }),
    gscQuery(token, {
      startDate: start,
      endDate: end,
      type: 'web',
      dimensions: ['query'],
      rowLimit: 50,
      orderBys: [{ fieldName: 'impressions', sortOrder: 'DESCENDING' }],
    }),
    gscQuery(token, {
      startDate: start,
      endDate: end,
      type: 'web',
      dimensions: ['page'],
      rowLimit: 25,
      orderBys: [{ fieldName: 'impressions', sortOrder: 'DESCENDING' }],
    }),
    gscQuery(token, {
      startDate: start,
      endDate: end,
      type: 'web',
      dimensions: ['date'],
      rowLimit: 31,
      orderBys: [{ fieldName: 'date', sortOrder: 'ASCENDING' }],
    }),
    gscQuery(token, {
      startDate: start,
      endDate: end,
      type: 'web',
      dimensions: ['device'],
      rowLimit: 5,
    }),
  ]);

  const cur = overallCur.rows?.[0] ?? { clicks: 0, impressions: 0, ctr: 0, position: 0 };
  const prev = overallPrev.rows?.[0] ?? { clicks: 0, impressions: 0, ctr: 0, position: 0 };

  console.log('--- KPI GSC (ÚLTIMOS 28 DIAS) ---');
  console.log(`Cliques: ${cur.clicks} (Anterior: ${prev.clicks})`);
  console.log(`Impressões: ${cur.impressions} (Anterior: ${prev.impressions})`);
  console.log(`CTR: ${(cur.ctr * 100).toFixed(2)}%`);
  console.log(`Posição Média: ${cur.position.toFixed(1)}`);

  console.log('\n--- TOP QUERIES (IMPRESSÕES NO GOOGLE) ---');
  queriesData.rows?.forEach((q, i) => {
    console.log(`${i + 1}. "${q.keys[0]}" | Impressões: ${q.impressions} | Cliques: ${q.clicks} | Posição: ${q.position.toFixed(1)}`);
  });

  console.log('\n--- TOP PÁGINAS NO GSC ---');
  pagesData.rows?.forEach((p, i) => {
    console.log(`${i + 1}. ${p.keys[0]} | Impressões: ${p.impressions} | Cliques: ${p.clicks} | Posição: ${p.position.toFixed(1)}`);
  });
}

main().catch(console.error);
