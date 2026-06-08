import { getAllComparativos } from '../comparativo/catalog';

/**
 * Normaliza posts MDX e comparativos num único feed para o /blog.
 */
export function buildBlogFeed(mdxPosts) {
  const articles = mdxPosts.map((post) => ({
    id: `mdx-${post.slug}`,
    slug: post.slug,
    title: post.title,
    description: post.description,
    date: post.date,
    readingTime: post.readingTime || '5 min',
    tags: post.tags || [],
    kind: 'article',
    badge: post.tags?.[0] || 'Artigo',
    href: `/blog/${post.slug}`,
  }));

  const comparativos = getAllComparativos().map((item) => ({
    id: `cmp-${item.slug}`,
    slug: item.slug,
    title: item.title,
    description: item.description,
    date: item.date,
    readingTime: item.readingTime || '4 min',
    tags: item.tags || [],
    kind: 'comparativo',
    badge: item.seriesLabel || 'Comparativo',
    href: `/blog/comparativo/${item.slug}`,
  }));

  return [...articles, ...comparativos].sort((a, b) => {
    if (a.date > b.date) return -1;
    if (a.date < b.date) return 1;
    return 0;
  });
}
