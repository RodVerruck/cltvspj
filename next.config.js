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
}

module.exports = nextConfig