/**
 * Script de configuração do Google Search Console — OAuth 2.0
 *
 * Executa um fluxo OAuth para obter um refresh token persistente da sua conta Google,
 * que tem acesso ao Search Console. Muito mais simples que adicionar Service Account.
 *
 * COMO USAR:
 * 1. No Google Cloud Console, crie credenciais OAuth 2.0 (tipo "Desktop app")
 *    Link: https://console.cloud.google.com/apis/credentials
 * 2. Adicione GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET ao .env.local
 * 3. Execute: node scripts/setup-gsc.mjs
 * 4. Faça login com a conta Google que tem acesso ao Search Console
 * 5. O GSC_REFRESH_TOKEN é salvo automaticamente no .env.local
 */

import { createServer } from 'http';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));

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

function saveTokenToEnv(key, value) {
  const envPath = resolve(__dirname, '../.env.local');
  let content = readFileSync(envPath, 'utf-8');

  const regex = new RegExp(`^${key}=.*$`, 'm');
  if (regex.test(content)) {
    content = content.replace(regex, `${key}=${value}`);
  } else {
    if (!content.endsWith('\n')) content += '\n';
    content += `${key}=${value}\n`;
  }

  writeFileSync(envPath, content);
  console.log(`✅ ${key} salvo no .env.local`);
}

async function exchangeCodeForTokens(code, clientId, clientSecret) {
  const params = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: 'http://localhost:3001/callback',
    grant_type: 'authorization_code',
  });

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  return res.json();
}

function openBrowser(url) {
  const cmd = process.platform === 'win32'
    ? `start "" "${url}"`
    : process.platform === 'darwin'
      ? `open "${url}"`
      : `xdg-open "${url}"`;
  exec(cmd, (err) => {
    if (err) console.log('⚠️  Não foi possível abrir o browser automaticamente.');
  });
}

async function main() {
  const env = loadEnv();

  const clientId = env.GOOGLE_CLIENT_ID;
  const clientSecret = env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('\n❌ GOOGLE_CLIENT_ID ou GOOGLE_CLIENT_SECRET não encontrados no .env.local\n');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  Como criar as credenciais OAuth (2 minutos):');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log('1. Acesse: https://console.cloud.google.com/apis/credentials');
    console.log('   (selecione o projeto "cltvspj" se precisar)\n');
    console.log('2. Clique em "+ CREATE CREDENTIALS" → "OAuth 2.0 Client ID"\n');
    console.log('3. Em "Application type", selecione: Desktop app');
    console.log('   Nome: CLT vs PJ Dashboard (pode colocar qualquer nome)\n');
    console.log('4. Clique em "CREATE"\n');
    console.log('5. Copie o "Client ID" e "Client Secret" que aparecerem\n');
    console.log('6. Adicione ao .env.local:');
    console.log('   GOOGLE_CLIENT_ID=seu_client_id_aqui');
    console.log('   GOOGLE_CLIENT_SECRET=seu_client_secret_aqui\n');
    console.log('7. Execute novamente: node scripts/setup-gsc.mjs\n');
    console.log('═══════════════════════════════════════════════════════════\n');
    process.exit(1);
  }

  const REDIRECT_URI = 'http://localhost:3001/callback';
  const SCOPE = [
    'https://www.googleapis.com/auth/webmasters.readonly',
  ].join(' ');

  const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' + new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: REDIRECT_URI,
    scope: SCOPE,
    access_type: 'offline',
    prompt: 'consent',
  }).toString();

  console.log('\n🔑 Iniciando autenticação OAuth para o Google Search Console\n');
  console.log('📂 Abrindo browser para autenticação...\n');
  openBrowser(authUrl);

  await new Promise((resolve) => {
    const server = createServer(async (req, res) => {
      const url = new URL(req.url, 'http://localhost:3001');
      if (url.pathname !== '/callback') {
        res.writeHead(404);
        res.end('Not found');
        return;
      }

      const code = url.searchParams.get('code');
      const error = url.searchParams.get('error');

      if (error) {
        console.error(`\n❌ Erro de autenticação: ${error}\n`);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(html('❌ Autenticação falhou', `Erro: ${error}`, '#f87171'));
        setTimeout(() => { server.close(); resolve(); }, 500);
        return;
      }

      if (!code) {
        res.writeHead(400);
        res.end('Código não encontrado na URL');
        return;
      }

      console.log('✅ Código de autorização recebido!');
      console.log('🔄 Trocando por tokens...\n');

      try {
        const tokens = await exchangeCodeForTokens(code, clientId, clientSecret);

        if (!tokens.refresh_token) {
          console.error('❌ Refresh token não retornado. Resposta:', JSON.stringify(tokens, null, 2));
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(html('❌ Erro', 'Refresh token não retornado. Tente novamente.', '#f87171'));
          setTimeout(() => { server.close(); resolve(); }, 500);
          return;
        }

        saveTokenToEnv('GSC_REFRESH_TOKEN', tokens.refresh_token);

        // Salva site URL se não existir
        if (!env.GSC_SITE_URL) {
          saveTokenToEnv('GSC_SITE_URL', 'https://calculadora-cltvspj.vercel.app/');
        }

        console.log('\n🎉 Configuração concluída com sucesso!\n');
        console.log('Próximo passo: reinicie o servidor com: npm run dev');
        console.log('Depois acesse /admin e veja a nova aba SEO!\n');

        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(html(
          '✅ Conectado com sucesso!',
          'O token foi salvo no .env.local. Pode fechar esta aba.<br><br>Reinicie o servidor com <code>npm run dev</code> e acesse <strong>/admin</strong>.',
          '#4ade80'
        ));

      } catch (err) {
        console.error('❌ Erro ao trocar código:', err.message);
        res.writeHead(500);
        res.end('Erro interno');
      }

      setTimeout(() => { server.close(); resolve(); }, 1000);
    });

    server.listen(3001, () => {
      console.log('⏳ Aguardando autenticação no browser...');
      console.log('   (servidor local em http://localhost:3001/callback)\n');
      console.log('Se o browser não abriu, cole esta URL manualmente:');
      console.log(authUrl);
      console.log();
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error('❌ Porta 3001 em uso. Feche outros processos nessa porta e tente novamente.');
      } else {
        console.error('❌ Erro no servidor:', err.message);
      }
      process.exit(1);
    });
  });
}

function html(title, body, color) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0f1117; color: #e2e8f0; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 24px; }
    .card { background: #151824; border: 1px solid #1f2335; border-radius: 16px; padding: 40px 36px; max-width: 480px; width: 100%; text-align: center; box-shadow: 0 24px 64px rgba(0,0,0,0.5); }
    .icon { font-size: 48px; margin-bottom: 16px; }
    h2 { color: ${color}; font-size: 22px; margin-bottom: 12px; }
    p { color: #9ca3af; font-size: 15px; line-height: 1.6; }
    code { background: #0f1117; padding: 2px 8px; border-radius: 4px; font-size: 13px; color: #4ade80; }
    strong { color: #e2e8f0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">${color === '#4ade80' ? '🎉' : '❌'}</div>
    <h2>${title}</h2>
    <p>${body}</p>
  </div>
</body>
</html>`;
}

main().catch((err) => {
  console.error('❌ Erro fatal:', err.message);
  process.exit(1);
});
