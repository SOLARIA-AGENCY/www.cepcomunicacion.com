/** @type {import('next').NextConfig} */
const nextConfig = {
  // Minimal configuration for development
  reactStrictMode: true,

  // Disable standalone output for static build
  // output: 'standalone',

  // Basic image configuration
  images: {
    domains: ['localhost', 'cepcomunicacion.com', 'www.cepcomunicacion.com'],
    unoptimized: true,
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
