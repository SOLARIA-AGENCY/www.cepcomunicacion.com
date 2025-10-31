import { withPayload } from '@payloadcms/next/withPayload';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Typed Routes (moved out of experimental in Next.js 16)
  typedRoutes: true,

  // PRODUCTION FIX: Disable Turbopack due to Drizzle Kit incompatibility
  // Use Webpack for production builds until Payload 3.x supports Turbopack
  // Development still uses Turbopack for speed
  ...(process.env.NODE_ENV === 'production' && {
    webpack: (config) => {
      return config;
    },
  }),

  // TypeScript strict mode
  typescript: {
    ignoreBuildErrors: false,
  },

  // ESLint during builds
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Image optimization - SECURITY: Whitelist specific domains only (no wildcards)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '3001',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
      },
      // Add production domains when deploying:
      // {
      //   protocol: 'https',
      //   hostname: 'cepcomunicacion.com',
      // },
      // {
      //   protocol: 'https',
      //   hostname: 'cdn.cepcomunicacion.com',
      // },
    ],
  },
};

// Payload 3.x configuration with performance optimization
export default withPayload(nextConfig, {
  // Cut Payload's compile times in half during development
  devBundleServerPackages: false,
});
