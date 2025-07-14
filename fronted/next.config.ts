import type { NextConfig } from "next";
require('dotenv').config({ path: '../.env' });


const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    domains: ['store.cuvvahairfibers.com','cuvvahairfibers.com', 'crownhairfibers.com', 'secure.gravatar.com'],
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
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,// Pass to client-side
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, // Stripe publishable key
    NEXT_PUBLIC_ADDRESS_FILLER_API_KEY: process.env.NEXT_PUBLIC_ADDRESS_FILLER_API_KEY, // Google Places API key
    NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY, // Google reCAPTCHA Site Key
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL, // Base URL for the site
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
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Expires',
            value: new Date(Date.now() + 31536000 * 1000).toUTCString(),
          },
        ],
      },
      {
        source: '/:path*\\.(js|css|png|jpg|jpeg|gif|ico|svg)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600', // 1 hour for pages
          },
        ],
      },
    ];
  },
};

export default nextConfig;
