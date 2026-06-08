import { SITE_URL } from '../config';
import {
  SITE_NAME,
  SITE_NAME_SEO,
  SITE_LANGUAGE,
  DEFAULT_OG_IMAGE,
} from './constants';

export function getPostUrl(slug, section = 'blog') {
  if (section === 'comparativo') {
    return `${SITE_URL}/blog/comparativo/${slug}`;
  }
  return `${SITE_URL}/blog/${slug}`;
}

export function getComparativosHubUrl() {
  return `${SITE_URL}/blog/comparativos`;
}

export function getPostPageTitle(title) {
  return `${title} | ${SITE_NAME_SEO}`;
}

function toIsoDate(dateStr) {
  if (!dateStr) return undefined;
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString().split('T')[0];
}

function toIsoDateTime(dateStr) {
  if (!dateStr) return undefined;
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
}

/**
 * Schema.org JSON-LD para posts do blog.
 * BlogPosting + BreadcrumbList + Organization (referência @id).
 */
export function getPostSchemaJsonLd(post, options = {}) {
  const { section = 'blog' } = options;
  const url = getPostUrl(post.slug, section);
  const datePublished = toIsoDate(post.date);
  const dateModified = toIsoDate(post.updatedDate || post.date);
  const authorName = post.author || 'Equipe CLT ou PJ';

  const breadcrumbItems = [
    {
      '@type': 'ListItem',
      position: 1,
      name: SITE_NAME,
      item: SITE_URL,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Blog',
      item: `${SITE_URL}/blog`,
    },
  ];

  if (section === 'comparativo') {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 3,
      name: 'Comparativos',
      item: getComparativosHubUrl(),
    });
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 4,
      name: post.title,
      item: url,
    });
  } else {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 3,
      name: post.title,
      item: url,
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: {
          '@type': 'ImageObject',
          url: DEFAULT_OG_IMAGE,
        },
      },
      {
        '@type': 'BlogPosting',
        '@id': `${url}/#article`,
        headline: post.title,
        description: post.description,
        url,
        inLanguage: SITE_LANGUAGE,
        ...(datePublished && { datePublished }),
        ...(dateModified && { dateModified }),
        author: {
          '@type': 'Organization',
          name: authorName,
        },
        publisher: { '@id': `${SITE_URL}/#organization` },
        image: {
          '@type': 'ImageObject',
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': url,
        },
        isPartOf: {
          '@type': 'Blog',
          '@id': `${SITE_URL}/blog#blog`,
          name: `Blog ${SITE_NAME}`,
          url: `${SITE_URL}/blog`,
        },
        ...(post.tags?.length > 0 && { keywords: post.tags.join(', ') }),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}/#breadcrumb`,
        itemListElement: breadcrumbItems,
      },
    ],
  };
}

export { toIsoDateTime };
