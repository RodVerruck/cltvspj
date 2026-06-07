/**
 * Script único para conceder acesso da Service Account à propriedade GA4.
 * 
 * O Google Analytics UI não aceita emails de Service Account pela interface normal.
 * Este script usa a Analytics Admin API para criar o vínculo programaticamente.
 * 
 * COMO USAR:
 * 1. Certifique-se que o .env.local está preenchido corretamente
 * 2. Execute: node scripts/grant-ga4-access.mjs
 * 3. A Service Account será adicionada como Leitora da propriedade GA4
 * 
 * ATENÇÃO: Este script precisa que a Service Account tenha a permissão
 * "Editor" ou "Administrador" na propriedade GA4 para criar vínculos.
 * Se falhar com 403, use o método alternativo abaixo (API Explorer).
 */

import { GoogleAuth } from 'google-auth-library';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Carrega o .env.local manualmente
function loadEnv() {
  try {
    const envPath = resolve(__dirname, '../.env.local');
    const content = readFileSync(envPath, 'utf-8');
    const env = {};
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      let value = trimmed.slice(eqIdx + 1).trim();
      // Remove aspas
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      env[key] = value;
    }
    return env;
  } catch (err) {
    console.error('❌ Não foi possível carregar .env.local:', err.message);
    process.exit(1);
  }
}

async function main() {
  const env = loadEnv();

  const GA4_PROPERTY_ID = env.GA4_PROPERTY_ID;
  const GA4_CLIENT_EMAIL = env.GA4_CLIENT_EMAIL;
  const GA4_PRIVATE_KEY = env.GA4_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!GA4_PROPERTY_ID || !GA4_CLIENT_EMAIL || !GA4_PRIVATE_KEY) {
    console.error('❌ Variáveis GA4_PROPERTY_ID, GA4_CLIENT_EMAIL ou GA4_PRIVATE_KEY não encontradas no .env.local');
    process.exit(1);
  }

  console.log(`\n🔑 Autenticando como: ${GA4_CLIENT_EMAIL}`);
  console.log(`📊 Propriedade GA4: ${GA4_PROPERTY_ID}\n`);

  const auth = new GoogleAuth({
    credentials: {
      client_email: GA4_CLIENT_EMAIL,
      private_key: GA4_PRIVATE_KEY,
    },
    scopes: [
      'https://www.googleapis.com/auth/analytics.manage.users',
      'https://www.googleapis.com/auth/analytics.edit',
    ],
  });

  try {
    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    const token = tokenResponse.token;

    console.log('✅ Token obtido com sucesso!\n');
    console.log('📡 Verificando acesso atual à propriedade...\n');

    // Tenta listar os access bindings existentes
    const listRes = await fetch(
      `https://analyticsadmin.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}/accessBindings`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const listData = await listRes.json();

    if (!listRes.ok) {
      console.log('⚠️  Resultado da listagem:', JSON.stringify(listData, null, 2));
      console.log('\n❌ A Service Account não tem permissão de gerenciar usuários na propriedade.');
      console.log('   Para resolver, use o MÉTODO ALTERNATIVO abaixo.\n');
      printAlternativeMethod(GA4_PROPERTY_ID, GA4_CLIENT_EMAIL);
      return;
    }

    // Verifica se já tem acesso
    const bindings = listData.accessBindings || [];
    const alreadyHasAccess = bindings.some(b => b.user === GA4_CLIENT_EMAIL);

    if (alreadyHasAccess) {
      console.log(`✅ A Service Account ${GA4_CLIENT_EMAIL} já tem acesso à propriedade!\n`);
      console.log('🎉 Tudo configurado. O dashboard deve funcionar agora.');
      return;
    }

    // Cria o vínculo de acesso
    console.log(`➕ Adicionando ${GA4_CLIENT_EMAIL} como Leitora...\n`);

    const createRes = await fetch(
      `https://analyticsadmin.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}/accessBindings`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: GA4_CLIENT_EMAIL,
          roles: ['predefinedRoles/viewer'],
        }),
      }
    );

    const createData = await createRes.json();

    if (!createRes.ok) {
      console.log('❌ Falha ao criar vínculo:', JSON.stringify(createData, null, 2));
      console.log('\n📋 Use o MÉTODO ALTERNATIVO abaixo:\n');
      printAlternativeMethod(GA4_PROPERTY_ID, GA4_CLIENT_EMAIL);
    } else {
      console.log('✅ Sucesso! Service Account adicionada como Leitora!\n');
      console.log('Detalhes:', JSON.stringify(createData, null, 2));
      console.log('\n🎉 Agora reinicie o servidor (npm run dev) e o dashboard vai funcionar!');
    }

  } catch (err) {
    console.error('❌ Erro:', err.message);
    console.log('\n📋 Use o MÉTODO ALTERNATIVO abaixo:\n');
    printAlternativeMethod(GA4_PROPERTY_ID, GA4_CLIENT_EMAIL);
  }
}

function printAlternativeMethod(propertyId, serviceEmail) {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('📋 MÉTODO ALTERNATIVO — API Explorer (2 minutos, sem instalar nada)');
  console.log('═══════════════════════════════════════════════════════════════\n');
  console.log('1. Acesse este link:');
  console.log('   https://developers.google.com/analytics/devguides/config/admin/v1/rest/v1beta/properties.accessBindings/create?apix=true\n');
  console.log('2. Em "parent", cole:');
  console.log(`   properties/${propertyId}\n`);
  console.log('3. Em "Request body", cole:');
  console.log(JSON.stringify({
    user: serviceEmail,
    roles: ['predefinedRoles/viewer'],
  }, null, 2));
  console.log('\n4. Clique em "EXECUTE" e faça login com sua conta Google quando pedido');
  console.log('5. Deve retornar 200 OK com os detalhes do vínculo criado');
  console.log('\n6. Reinicie o servidor: npm run dev');
  console.log('\n═══════════════════════════════════════════════════════════════\n');
}

main();
