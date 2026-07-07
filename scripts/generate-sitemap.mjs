import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { SALARY_BANDS } from '../src/data/comparativos/salary-bands.js';
import { CASE_STUDIES } from '../src/data/comparativos/case-studies.js';
import { PROFESSIONS } from '../src/data/comparativos/professions.js';

// URL do site definida dinamicamente por variável de ambiente (facilita troca de domínio)
const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://calculadora-cltvspj.vercel.app';
const postsDirectory = path.join(process.cwd(), 'posts');

function toSitemapDate(value) {
  return new Date(value).toISOString().split('T')[0];
}

// Leitura de posts no build sem dependência de typescript no compilador
function getBuildPosts() {
  if (!fs.existsSync(postsDirectory)) return [];
  const fileNames = fs.readdirSync(postsDirectory);
  const posts = fileNames
    .filter((name) => (name.endsWith('.mdx') || name.endsWith('.md')) && !name.startsWith('_'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx?$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);
      return {
        slug,
        date: data.date || '',
      };
    });
  return posts.sort((a, b) => (a.date > b.date ? -1 : 1));
}

// Data de modificação baseada estritamente no post mais recente do blog (não muda com deploy se o conteúdo não mudou)
function getHomeLastMod(posts) {
  const dates = [];
  for (const post of posts) {
    if (post.date) {
      dates.push(new Date(post.date));
    }
  }
  if (dates.length === 0) {
    return null;
  }
  const latest = dates.reduce((max, current) => (current > max ? current : max));
  return toSitemapDate(latest);
}

function generateXML(posts, comparativos) {
  const homeLastMod = getHomeLastMod(posts);
  const homeLastModTag = homeLastMod ? `\n    <lastmod>${homeLastMod}</lastmod>` : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}</loc>${homeLastModTag}
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_URL}/blog</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${SITE_URL}/blog/comparativos</loc>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  ${posts
    .map(({ slug, date }) => {
      const postDateTag = date ? `\n    <lastmod>${toSitemapDate(date)}</lastmod>` : '';
      return `
  <url>
    <loc>${SITE_URL}/blog/${slug}</loc>${postDateTag}
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
    })
    .join('')}
  ${comparativos
    .map(({ slug }) => {
      // Comparativos não possuem data no frontmatter e não usarão data dinâmica do build.
      // O Google prefere a ausência da tag <lastmod> a uma data enganosa que muda a cada build/deploy.
      return `
  <url>
    <loc>${SITE_URL}/blog/comparativo/${slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.75</priority>
  </url>`;
    })
    .join('')}
</urlset>`;
}

async function run() {
  console.log('Iniciando geração estática do sitemap.xml...');
  const posts = getBuildPosts();
  const comparativos = [...SALARY_BANDS, ...CASE_STUDIES, ...PROFESSIONS];
  
  // 1. Gerar sitemap.xml
  const xml = generateXML(posts, comparativos);
  const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  fs.writeFileSync(sitemapPath, xml, 'utf8');
  console.log(`Sitemap gerado com sucesso em: ${sitemapPath}`);

  // 2. Gerar robots.txt de forma centralizada e sintonizada com a URL
  console.log('Gerando robots.txt estático...');
  const robotsText = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
  const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
  fs.writeFileSync(robotsPath, robotsText, 'utf8');
  console.log(`robots.txt gerado com sucesso em: ${robotsPath}`);

  console.log(`Processo de geração estática concluído. Total de ${3 + posts.length + comparativos.length} URLs mapeadas.`);
}

run().catch(console.error);
