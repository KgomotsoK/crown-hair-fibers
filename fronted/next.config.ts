import type { NextConfig } from "next";
require('dotenv').config({ path: '../.env' });

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    domains: ['store.crownhairfibers.com', 'crownhairfibers.com', 'secure.gravatar.com'],
  },
  // Add output configuration for static export if needed
  // output: 'export',
  
  // Enable React strict mode for better development
  reactStrictMode: true,
  // Optimize production builds
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000', // Pass to client-side
  },
  
  // Configure headers for security
  headers: async () => {
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
        ],
      },
    ];
  },
};

export default nextConfig;
