import fs from 'fs';
import path from 'path';
import { getAllPosts } from '../lib/posts';
import { getAllComparativoConfigs } from '../lib/comparativo/catalog';
import { SITE_URL } from '../lib/config';

function toSitemapDate(value) {
  return new Date(value).toISOString().split('T')[0];
}

const postsDirectory = path.join(process.cwd(), 'posts');

/** Data mais recente entre posts, deploy e alterações de conteúdo. */
function getHomeLastMod(posts) {
  const dates = [];

  for (const post of posts) {
    if (post.date) {
      dates.push(new Date(post.date));
    }
  }

  // MDX em posts/ existe no runtime da Vercel (src/ compilado não)
  if (fs.existsSync(postsDirectory)) {
    for (const fileName of fs.readdirSync(postsDirectory)) {
      if (!fileName.endsWith('.mdx') && !fileName.endsWith('.md')) continue;
      dates.push(fs.statSync(path.join(postsDirectory, fileName)).mtime);
    }
  }

  if (process.env.SITE_BUILD_DATE) {
    dates.push(new Date(process.env.SITE_BUILD_DATE));
  }

  if (dates.length === 0) {
    return toSitemapDate(new Date());
  }

  const latest = dates.reduce((max, current) => (current > max ? current : max));
  return toSitemapDate(latest);
}

function generateSiteMap(posts, comparativos) {
  const homeLastMod = getHomeLastMod(posts);
  const comparativoDate = process.env.SITE_BUILD_DATE || toSitemapDate(new Date());

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
  <url>
    <loc>${SITE_URL}/blog/comparativos</loc>
    <lastmod>${comparativoDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
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
  ${comparativos
    .map(({ slug }) => {
      return `
  <url>
    <loc>${SITE_URL}/blog/comparativo/${slug}</loc>
    <lastmod>${comparativoDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.75</priority>
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
  const comparativos = getAllComparativoConfigs();
  const sitemap = generateSiteMap(posts, comparativos);

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return { props: {} };
}
