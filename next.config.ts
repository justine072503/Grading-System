import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React Strict Mode for better development experience
  reactStrictMode: true,

  // Disable server-side image optimization (not needed for this app)
  images: {
    unoptimized: true,
  },

  // Ensure client-side only code works properly
  // (important for localStorage functionality)
  swcMinify: true,

  // Headers for better security and caching
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
        ],
      },
    ];
  },

  // Environment variables (optional)
  env: {
    NEXT_PUBLIC_APP_NAME: 'Ransohan Fiesta Grading System',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
  },
};

export default nextConfig;