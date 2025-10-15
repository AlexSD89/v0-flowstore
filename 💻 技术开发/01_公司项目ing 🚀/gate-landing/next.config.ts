import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "logos.composio.dev",
      },
      {
        protocol: "https",
        hostname: "assets.vercel.com",
      },
    ],
  },
};

export default nextConfig;
