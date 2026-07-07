import fs from 'fs';
import path from 'path';

async function validateSitemap() {
  const url = 'https://calculadora-cltvspj.vercel.app/sitemap.xml';
  const localPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  
  let xmlText;
  if (process.argv.includes('--local') || fs.existsSync(localPath)) {
    console.log(`Lendo sitemap local de: ${localPath}`);
    try {
      xmlText = fs.readFileSync(localPath, 'utf8');
      console.log('Sitemap local lido com sucesso. Iniciando validação...\n');
    } catch (err) {
      console.error(`Erro ao ler sitemap local: ${err.message}`);
      process.exit(1);
    }
  } else {
    console.log(`Buscando sitemap remoto de: ${url}`);
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Falha HTTP ao buscar sitemap: ${res.status} ${res.statusText}`);
      }
      xmlText = await res.text();
      console.log('Sitemap remoto baixado com sucesso. Iniciando validação...\n');
    } catch (err) {
      console.error(`Erro ao fazer fetch do sitemap: ${err.message}`);
      process.exit(1);
    }
  }

  const lines = xmlText.split('\n');
  const errors = [];
  const warnings = [];
  const urls = [];
  const uniqueUrls = new Set();
  
  // 1. Validação UTF-8
  try {
    new TextDecoder('utf-8', { fatal: true }).decode(Buffer.from(xmlText, 'utf-8'));
  } catch (e) {
    errors.push({ line: 0, msg: 'O XML contém sequências de bytes UTF-8 inválidas.' });
  }

  // 2. Namespace e estrutura básica
  const hasXmlDecl = xmlText.startsWith('<?xml');
  const hasUrlsetNamespace = xmlText.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
  
  if (!hasXmlDecl) {
    errors.push({ line: 1, msg: 'A declaração XML <?xml version="1.0" encoding="UTF-8"?> está ausente ou mal posicionada no início do arquivo.' });
  }
  if (!xmlText.includes('<urlset')) {
    errors.push({ line: 1, msg: 'A tag raiz <urlset> está ausente.' });
  } else if (!hasUrlsetNamespace) {
    errors.push({ line: 1, msg: 'A tag <urlset> não possui o namespace oficial xmlns="http://www.sitemaps.org/schemas/sitemap/0.9".' });
  }

  // Tags abertas/fechadas (Validador simples de balanço de tags XML)
  const tagStack = [];
  const tagRegex = /<\/?([a-zA-Z0-9_:]+)(?:\s+[^>]*)?>/g;
  let match;

  // Para rastrear linhas de forma simples
  const getLineNumber = (index) => {
    return xmlText.substring(0, index).split('\n').length;
  };

  while ((match = tagRegex.exec(xmlText)) !== null) {
    const fullTag = match[0];
    const tagName = match[1];
    const isClosing = fullTag.startsWith('</');
    const currentLine = getLineNumber(match.index);

    if (tagName === 'xml') continue; // declaração XML não empilha

    if (isClosing) {
      if (tagStack.length === 0) {
        errors.push({ line: currentLine, msg: `Tag de fechamento </${tagName}> encontrada sem tag de abertura correspondente.` });
      } else {
        const lastOpen = tagStack.pop();
        if (lastOpen.name !== tagName) {
          errors.push({ line: currentLine, msg: `Tag de fechamento </${tagName}> não corresponde à tag de abertura <${lastOpen.name}> (linha ${lastOpen.line}).` });
        }
      }
    } else {
      // É abertura
      if (!fullTag.endsWith('/>')) { // Ignora tags auto-fechadas
        tagStack.push({ name: tagName, line: currentLine });
      }
    }
  }

  while (tagStack.length > 0) {
    const unclosed = tagStack.pop();
    errors.push({ line: unclosed.line, msg: `Tag <${unclosed.name}> aberta na linha ${unclosed.line} nunca foi fechada.` });
  }

  // 3. Validação das URLs e propriedades internas
  const urlBlocks = [];
  const urlBlockRegex = /<url>([\s\S]*?)<\/url>/g;
  while ((match = urlBlockRegex.exec(xmlText)) !== null) {
    urlBlocks.push({ content: match[1], line: getLineNumber(match.index) });
  }

  urlBlocks.forEach((block, idx) => {
    const locMatch = /<loc>([\s\S]*?)<\/loc>/.exec(block.content);
    const lastmodMatch = /<lastmod>([\s\S]*?)<\/lastmod>/.exec(block.content);
    const priorityMatch = /<priority>([\s\S]*?)<\/priority>/.exec(block.content);
    const changefreqMatch = /<changefreq>([\s\S]*?)<\/changefreq>/.exec(block.content);

    // Validação do <loc> (URL)
    if (!locMatch) {
      errors.push({ line: block.line, msg: `Bloco <url> número ${idx + 1} não contém a tag obrigatória <loc>.` });
    } else {
      const locValue = locMatch[1].trim();
      const locLine = block.line + block.content.substring(0, locMatch.index).split('\n').length - 1;

      // URLs absolutas?
      if (!locValue.startsWith('http://') && !locValue.startsWith('https://')) {
        errors.push({ line: locLine, msg: `A URL "${locValue}" não é absoluta (deve iniciar com http:// ou https://).` });
      }

      // URL vazia ou inválida?
      if (locValue === '') {
        errors.push({ line: locLine, msg: `A tag <loc> está vazia.` });
      } else {
        try {
          new URL(locValue);
        } catch (e) {
          errors.push({ line: locLine, msg: `A URL "${locValue}" é sintaticamente inválida.` });
        }
      }

      // Duplicada?
      if (uniqueUrls.has(locValue)) {
        warnings.push({ line: locLine, msg: `URL duplicada encontrada: "${locValue}".` });
      } else {
        uniqueUrls.add(locValue);
      }

      urls.push(locValue);

      // Caracteres não escapados no <loc>?
      const rawAmpRegex = /&(?!amp;|apos;|quot;|lt;|gt;|#[0-9]+;|#x[0-9a-fA-F]+;)/;
      if (rawAmpRegex.test(locValue)) {
        errors.push({ line: locLine, msg: `A URL "${locValue}" contém o caractere especial "&" não escapado. Use "&amp;".` });
      }
      if (locValue.includes('<') || locValue.includes('>')) {
        errors.push({ line: locLine, msg: `A URL "${locValue}" contém caracteres "<" ou ">" inválidos.` });
      }
    }

    // Validação do <lastmod>
    if (lastmodMatch) {
      const lastmodValue = lastmodMatch[1].trim();
      const lastmodLine = block.line + block.content.substring(0, lastmodMatch.index).split('\n').length - 1;
      
      const iso8601Regex = /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?)?$/;
      if (!iso8601Regex.test(lastmodValue)) {
        errors.push({ line: lastmodLine, msg: `O valor de <lastmod> "${lastmodValue}" não segue o formato ISO 8601 (ex: YYYY-MM-DD).` });
      }
    }

    // Validação do <priority>
    if (priorityMatch) {
      const priorityValue = priorityMatch[1].trim();
      const priorityLine = block.line + block.content.substring(0, priorityMatch.index).split('\n').length - 1;
      const num = parseFloat(priorityValue);
      if (isNaN(num) || num < 0.0 || num > 1.0) {
        errors.push({ line: priorityLine, msg: `O valor de <priority> "${priorityValue}" deve ser um número decimal entre 0.0 e 1.0.` });
      }
    }

    // Validação do <changefreq>
    if (changefreqMatch) {
      const changefreqValue = changefreqMatch[1].trim();
      const changefreqLine = block.line + block.content.substring(0, changefreqMatch.index).split('\n').length - 1;
      const validFreqs = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];
      if (!validFreqs.includes(changefreqValue.toLowerCase())) {
        errors.push({ line: changefreqLine, msg: `O valor de <changefreq> "${changefreqValue}" é inválido. Valores permitidos: ${validFreqs.join(', ')}.` });
      }
    }
  });

  // Validação geral de "&" cru no arquivo inteiro fora de tags
  const rawAmpInFileRegex = /&(?!amp;|apos;|quot;|lt;|gt;|#[0-9]+;|#x[0-9a-fA-F]+;)/g;
  let fileMatch;
  while ((fileMatch = rawAmpInFileRegex.exec(xmlText)) !== null) {
    const fileLine = getLineNumber(fileMatch.index);
    errors.push({ line: fileLine, msg: `Caractere "&" não escapado encontrado no arquivo geral.` });
  }

  console.log('\n--- RESULTADOS DA AUDITORIA ---');
  console.log(`Total de URLs testadas: ${urls.length}`);
  console.log(`Total de URLs únicas: ${uniqueUrls.size}`);
  console.log(`Erros Críticos (Violações de Protocolo): ${errors.length}`);
  console.log(`Avisos (Boas Práticas / Duplicatas): ${warnings.length}`);
  
  if (errors.length > 0) {
    console.log('\n❌ ERROS ENCONTRADOS:');
    errors.forEach(e => {
      console.log(`- Linha ${e.line}: ${e.msg}`);
    });
  } else {
    console.log('\n✅ NENHUM ERRO CRÍTICO ENCONTRADO! O XML está em total conformidade sintática com o protocolo Sitemap.');
  }

  if (warnings.length > 0) {
    console.log('\n⚠️ AVISOS / ALERTAS:');
    warnings.forEach(w => {
      console.log(`- Linha ${w.line}: ${w.msg}`);
    });
  }

  console.log('\n--- ARQUIVO XML SALVO ---');
  const outPath = path.join(process.cwd(), 'scripts', 'sitemap_actual.xml');
  fs.writeFileSync(outPath, xmlText, 'utf8');
  console.log(`XML completo salvo em UTF-8: ${outPath}`);
}

validateSitemap();
