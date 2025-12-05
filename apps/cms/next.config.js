/** @type {import('next').NextConfig} */
const nextConfig = {
  // Visual-First Development: Bypass TypeScript build errors during UI development phase
  // See: docs/VISUAL_FIRST_DEVELOPMENT.md
  // Will be re-enabled (set to false) when connecting to real Payload API (no more mock data)
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Required for Payload CMS
  reactStrictMode: true,

  // ============================================================================
  // PERFORMANCE OPTIMIZATIONS
  // ============================================================================

  // Image optimization with modern formats
  images: {
    domains: ['localhost', '46.62.222.138', 'cepcomunicacion.com'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Compiler optimizations (SWC)
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Enable response compression
  compress: true,

  // Generate ETags for static assets
  generateEtags: true,

  // Optimize package imports (tree-shaking)
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}',
    },
  },

  // Headers for caching and security
  async headers() {
    return [
      {
        // Static assets - aggressive caching
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // API routes - short cache with revalidation
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 's-maxage=10, stale-while-revalidate=59' },
        ],
      },
      {
        // Security headers for all routes
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },

  // Experimental features for Payload CMS 3.x compatibility
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '46.62.222.138'],
    },
    // Enable Partial Prerendering (Next.js 15+)
    // ppr: true,
  },

  // Webpack optimizations
  webpack: (config, { isServer }) => {
    // Optimize bundle splitting
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          // Separate vendor chunks
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          // Common components
          common: {
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      }
    }
    return config
  },
}

export default nextConfig
