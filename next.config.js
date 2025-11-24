import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Configure for static export
  output: "export",
  // Disable telemetry
  telemetry: { enabled: false },
  // Configure base path for GitHub Pages (update with your repo name)
  basePath: process.env.NODE_ENV === "production" ? "/v0-flowstore" : "",
  // Configure asset prefix for GitHub Pages
  assetPrefix: process.env.NODE_ENV === "production" ? "/v0-flowstore" : "",
  // Ensure images work in static build
  images: {
    loader: "custom",
    loaderFile: "./image-loader.ts",
    unoptimized: true
  },
  // Disable strict mode for static build
  reactStrictMode: false,
  // Ensure trailing slash for GitHub Pages
  trailingSlash: true,
  // Remove server-side features
  swcMinify: true,
  // Ensure static generation
  experimental: {
    ssr: false
  }
}

export default nextConfig