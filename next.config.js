/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  typescript: {
    ignoreBuildErrors: true
  },
  // Add crossOrigin configuration
  crossOrigin: 'anonymous',
  // Disable React strict mode for now to prevent double-mounting issues
  reactStrictMode: false,
};

module.exports = nextConfig;