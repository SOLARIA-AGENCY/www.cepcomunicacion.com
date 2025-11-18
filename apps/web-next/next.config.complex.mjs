/** @type {import('next').NextConfig} */
const nextConfig = {
  // Minimal configuration for development
  reactStrictMode: true,
  
  // Basic image domains
  images: {
    domains: ['localhost'],
  },
  
  // Enable development features
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Disable TypeScript errors for now
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;