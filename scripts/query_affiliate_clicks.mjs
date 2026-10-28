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

const GA4_PROPERTY_ID = env.GA4_PROPERTY_ID;
const GA4_CLIENT_EMAIL = env.GA4_CLIENT_EMAIL;
const GA4_PRIVATE_KEY = env.GA4_PRIVATE_KEY;

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

async function main() {
  const token = await getGAAuthToken();

  console.log('--- RELATÓRIO DE EVENTOS DE AFILIADOS (affiliate_click) ---');

  // Consulta todos os eventos
  const eventsReport = await runGAReport(token, {
    dateRanges: [{ startDate: '2025-01-01', endDate: 'today' }],
    dimensions: [{ name: 'eventName' }],
    metrics: [{ name: 'eventCount' }, { name: 'totalUsers' }],
  });

  console.log('Todos os eventos registrados:');
  eventsReport.rows?.forEach(r => {
    console.log(`Evento: ${r.dimensionValues[0].value} | Contagem: ${r.metricValues[0].value} | Usuários: ${r.metricValues[1].value}`);
  });

  // Consulta affiliate_click por data/mês
  try {
    const affiliateByDate = await runGAReport(token, {
      dateRanges: [{ startDate: '2025-01-01', endDate: 'today' }],
      dimensions: [{ name: 'yearMonth' }, { name: 'eventName' }],
      dimensionFilter: {
        filter: {
          fieldName: 'eventName',
          stringFilter: {
            value: 'affiliate_click',
            matchType: 'EXACT',
          },
        },
      },
      metrics: [{ name: 'eventCount' }, { name: 'totalUsers' }],
    });

    console.log('\nCliques de afiliado por Mês:');
    affiliateByDate.rows?.forEach(r => {
      console.log(`Mês: ${r.dimensionValues[0].value} | Evento: ${r.dimensionValues[1].value} | Cliques: ${r.metricValues[0].value} | Usuários: ${r.metricValues[1].value}`);
    });
  } catch (e) {
    console.log('Erro ao filtrar por affiliate_click:', e.message);
  }

  // Consulta por página onde ocorreu o clique ou pagePath
  try {
    const affiliateByPage = await runGAReport(token, {
      dateRanges: [{ startDate: '2025-01-01', endDate: 'today' }],
      dimensions: [{ name: 'pagePath' }],
      dimensionFilter: {
        filter: {
          fieldName: 'pagePath',
          stringFilter: {
            value: '/go/',
            matchType: 'CONTAINS',
          },
        },
      },
      metrics: [{ name: 'screenPageViews' }, { name: 'totalUsers' }],
    });

    console.log('\nAcessos a rotas /go/ (Redirecionamentos de afiliados):');
    affiliateByPage.rows?.forEach(r => {
      console.log(`Rota: ${r.dimensionValues[0].value} | Visualizações: ${r.metricValues[0].value} | Usuários: ${r.metricValues[1].value}`);
    });
  } catch (e) {
    console.log('Erro ao consultar /go/:', e.message);
  }
}

main().catch(console.error);
