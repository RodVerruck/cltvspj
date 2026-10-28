import assert from 'assert';

async function testRoutes() {
  const routes = [
    '/',
    '/blog',
    '/blog/comparativos',
    '/blog/comparativo/clt-ou-pj-desenvolvedor-junior',
    '/blog/comparativo/clt-ou-pj-tech-lead',
    '/blog/comparativo/clt-ou-pj-engenheiro-dados',
    '/blog/comparativo/clt-ou-pj-arquiteto-software',
    '/blog/comparativo/clt-ou-pj-desenvolvedor-mobile',
    '/blog/comparativo/clt-10000-vs-pj-15000',
    '/blog/pj-para-desenvolvedores-vale-a-pena',
  ];

  console.log('🧪 Testando rotas no servidor local (http://localhost:3000)...');

  for (const r of routes) {
    const res = await fetch(`http://localhost:3000${r}`);
    assert.strictEqual(res.status, 200, `Rota ${r} deveria retornar 200`);
    const html = await res.text();
    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    const title = titleMatch ? titleMatch[1] : 'SEM_TITULO';
    const descMatch = html.match(/<meta name="description" content="([^"]+)"/);
    const desc = descMatch ? descMatch[1] : 'SEM_DESCRIPTION';
    const canonicalMatch = html.match(/<link rel="canonical" href="([^"]+)"/);
    const canonical = canonicalMatch ? canonicalMatch[1] : 'SEM_CANONICAL';

    console.log(`\n✅ ${r}`);
    console.log(`   Title: ${title}`);
    console.log(`   Desc: ${desc.slice(0, 90)}...`);
    console.log(`   Canonical: ${canonical}`);
  }

  console.log('\n🎉 Todas as rotas testadas com sucesso!');
}

testRoutes().catch((e) => {
  console.error('❌ Falha:', e);
  process.exit(1);
});
