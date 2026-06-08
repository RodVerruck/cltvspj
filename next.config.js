/** @type {import('next').NextConfig} */
const siteBuildDate = new Date().toISOString().split('T')[0];

const nextConfig = {
  env: {
    // Data do build/deploy — usada no lastmod da home (Vercel não expõe src/ em runtime)
    SITE_BUILD_DATE: siteBuildDate,
  },
  reactStrictMode: true,
  experimental: {
    mdxRs: true,
  },
  async headers() {
    return [
      {
        source: '/go/:slug*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/blog/simples-nacional-pj-qual-anexo-escolher',
        destination: '/blog/simples-nacional-pj-qual-anexo',
        permanent: true,
      },
    ];
  },
}

module.exports = nextConfig