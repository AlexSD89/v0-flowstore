/** @type {import('next').NextConfig} */
const nextConfig = {
  // Experimental features
  experimental: {
    // Enable server components
    serverComponentsExternalPackages: ['@prisma/client'],
    // TypeScript strict mode
    typedRoutes: true,
  },

  // Build configuration
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Public runtime config
  publicRuntimeConfig: {
    APP_NAME: 'AI Investment MRR Tracker',
    APP_VERSION: '1.0.0-alpha',
  },

  // Image optimization
  images: {
    domains: [
      'localhost',
      'ai-mrr-tracker.com',
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com',
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400, // 24 hours
  },

  // TypeScript configuration
  typescript: {
    // Enable type checking during build
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    // Enable ESLint during build
    ignoreDuringBuilds: false,
    dirs: ['src', 'pages', 'components', 'lib', 'utils'],
  },

  // Bundle analyzer
  ...(process.env.ANALYZE === 'true' && {
    bundleAnalyzerConfig: {
      server: {
        analyzerMode: 'server',
        analyzerPort: 8888,
      },
      client: {
        analyzerMode: 'static',
        reportFilename: '../bundle-analyzer/client.html',
      },
    },
  }),

  // Webpack configuration
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add custom webpack configurations
    
    // Optimize bundle size
    if (!dev && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, 'src'),
      };
    }

    // Bundle analyzer
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: isServer
            ? '../bundle-analyzer/server.html'
            : '../bundle-analyzer/client.html',
          openAnalyzer: false,
        })
      );
    }

    // Handle specific modules
    config.externals = config.externals || {};
    config.externals['bufferutil'] = 'bufferutil';
    config.externals['utf-8-validate'] = 'utf-8-validate';
    config.externals['supports-color'] = 'supports-color';

    return config;
  },

  // Headers configuration
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      // Redirect old routes if any
      // {
      //   source: '/old-route',
      //   destination: '/new-route',
      //   permanent: true,
      // },
    ];
  },

  // Rewrites for API routes
  async rewrites() {
    return [
      {
        source: '/api/health',
        destination: '/api/system/health',
      },
      {
        source: '/api/metrics',
        destination: '/api/system/metrics',
      },
    ];
  },

  // CORS handling
  async headers() {
    const corsHeaders = [
      {
        key: 'Access-Control-Allow-Origin',
        value: process.env.CORS_ORIGINS || 'http://localhost:3000',
      },
      {
        key: 'Access-Control-Allow-Credentials',
        value: 'true',
      },
      {
        key: 'Access-Control-Allow-Methods',
        value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
      },
      {
        key: 'Access-Control-Allow-Headers',
        value:
          'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization',
      },
    ];

    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/(.*)',
          headers: corsHeaders,
        },
      ];
    }

    return [];
  },

  // Development configuration
  ...(process.env.NODE_ENV === 'development' && {
    onDemandEntries: {
      maxInactiveAge: 25 * 1000,
      pagesBufferLength: 2,
    },
  }),

  // Production optimizations
  ...(process.env.NODE_ENV === 'production' && {
    compiler: {
      // Remove console.log in production
      removeConsole: {
        exclude: ['error'],
      },
    },
    // Enable SWC minification
    swcMinify: true,
  }),

  // Logging
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'development',
    },
  },
};

// Handle path resolution
const path = require('path');

module.exports = nextConfig;