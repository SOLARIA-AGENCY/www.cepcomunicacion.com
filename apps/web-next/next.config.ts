import { withPayload } from '@payloadcms/next/withPayload';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Typed Routes (moved out of experimental in Next.js 16)
  typedRoutes: true,

  // Turbopack is now stable in Next.js 16 (default bundler)
  turbopack: {},

  // TypeScript strict mode
  typescript: {
    ignoreBuildErrors: false,
  },

  // ESLint during builds
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

// Payload 3.x configuration with performance optimization
export default withPayload(nextConfig, {
  // Cut Payload's compile times in half during development
  devBundleServerPackages: false,
});
