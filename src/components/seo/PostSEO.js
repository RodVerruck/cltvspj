import Head from 'next/head';
import {
  getPostUrl,
  getPostPageTitle,
  getPostSchemaJsonLd,
  toIsoDateTime,
} from '../../lib/seo/post';
import {
  SITE_NAME,
  DEFAULT_OG_IMAGE,
  OG_IMAGE_WIDTH,
  OG_IMAGE_HEIGHT,
  SITE_LOCALE,
} from '../../lib/seo/constants';

/**
 * Meta tags, Open Graph, Twitter Card e JSON-LD centralizados para posts do blog.
 * Basta preencher o frontmatter do .mdx — o template aplica o resto.
 */
export default function PostSEO({ post, section = 'blog' }) {
  const url = getPostUrl(post.slug, section);
  const pageTitle = getPostPageTitle(post.title);
  const schema = getPostSchemaJsonLd(post, { section });
  const keywords = post.tags?.join(', ') || '';
  const author = post.author || 'Equipe CLT ou PJ';
  const publishedTime = toIsoDateTime(post.date);
  const modifiedTime = toIsoDateTime(post.updatedDate || post.date);

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={post.description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content="article" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={post.title} />
      <meta property="og:description" content={post.description} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={SITE_LOCALE} />
      <meta property="og:image" content={DEFAULT_OG_IMAGE} />
      <meta property="og:image:width" content={OG_IMAGE_WIDTH} />
      <meta property="og:image:height" content={OG_IMAGE_HEIGHT} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {post.tags?.map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={post.title} />
      <meta name="twitter:description" content={post.description} />
      <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />

      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  );
}
