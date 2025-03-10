/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'solearn.io',
      'assets.solearn.io',
      'arweave.net',
      'storage.googleapis.com',
    ],
  },
  webpack: (config) => {
    // Add custom webpack configs for Solana web3.js compatibility
    config.resolve.fallback = {
      fs: false,
      os: false,
      path: false,
      crypto: false,
    };
    return config;
  },
}

module.exports = nextConfig 