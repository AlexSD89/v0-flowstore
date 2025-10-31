/** @type {import('next').NextConfig} */
const nextConfig = {
  // 简化配置，跳过类型检查和eslint
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    // turbo: true,
  },
};

module.exports = nextConfig;