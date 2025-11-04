import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Payload requires experimental features
  experimental: {
    reactCompiler: false,
  },
  // Disable ESLint during build (legacy files)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript checking during build (Payload admin templates)
  typescript: {
    ignoreBuildErrors: true,
  },
  // Output file tracing root (suppress multiple lockfiles warning)
  output: 'standalone',
  outputFileTracingRoot: undefined, // Use project root
}

export default withPayload(nextConfig)
