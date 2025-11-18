/** @type {import('next').NextConfig} */
const nextConfig = {
  // Minimal configuration for development
  reactStrictMode: true,

  // Enable standalone output for Docker
  output: 'standalone',

  // Basic image configuration
  images: {
    domains: ['localhost', 'cepcomunicacion.com', 'www.cepcomunicacion.com'],
  },

  // Disable checks for development
  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
