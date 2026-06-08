import fs from 'fs';
import path from 'path';
import { getAllPosts } from '../lib/posts';
import { SITE_URL } from '../lib/config';

function toSitemapDate(value) {
  return new Date(value).toISOString().split('T')[0];
}

/** Data mais recente entre posts e arquivos da home/calculadora. */
function getHomeLastMod(posts) {
  const dates = [];

  if (posts[0]?.date) {
    dates.push(new Date(posts[0].date));
  }

  const homeFiles = [
    'src/pages/index.js',
    'src/lib/calculator.js',
    'src/lib/schema/calculator.js',
  ];

  for (const relativePath of homeFiles) {
    const fullPath = path.join(process.cwd(), relativePath);
    if (fs.existsSync(fullPath)) {
      dates.push(fs.statSync(fullPath).mtime);
    }
  }

  if (dates.length === 0) {
    return toSitemapDate(new Date());
  }

  const latest = dates.reduce((max, current) => (current > max ? current : max));
  return toSitemapDate(latest);
}

function generateSiteMap(posts) {
  const homeLastMod = getHomeLastMod(posts);

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}</loc>
    <lastmod>${homeLastMod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_URL}/blog</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  ${posts
    .map(({ slug, date }) => {
      return `
  <url>
    <loc>${SITE_URL}/blog/${slug}</loc>
    <lastmod>${toSitemapDate(date)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
    })
    .join('')}
</urlset>`;
}

export default function SiteMap() {
  return null;
}

export async function getServerSideProps({ res }) {
  const posts = await getAllPosts();
  const sitemap = generateSiteMap(posts);

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return { props: {} };
}
