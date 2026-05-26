/** @type {import('next').NextConfig} */
const nextConfig = {
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