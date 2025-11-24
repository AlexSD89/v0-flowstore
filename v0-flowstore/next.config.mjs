/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    loader: 'custom',
    loaderFile: './image-loader.ts',
  },
  basePath: process.env.NODE_ENV === 'production' ? '/v0-flowstore' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/v0-flowstore/' : '',
}

export default nextConfig
