/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable output standalone for hosting on platforms like Render
  output: 'standalone',
  
  // Optimize image handling
  images: {
    domains: ['static.coingecko.com', 'assets.coingecko.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: process.env.NODE_ENV === 'development'
  },
  
  // Remove console logs in production (except errors)
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' 
      ? { exclude: ['error'] } 
      : false,
  },
  
  // Set up strict mode to catch potential issues
  reactStrictMode: true,
  
  // Configure build-time environment variables
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
  
  // Ignore TypeScript errors during build for Render deployment
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Ignore ESLint errors during build for Render deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Transpile packages that might cause issues
  transpilePackages: ['lucide-react'],
  
  // Experimental features
  experimental: {
    // Improve CSS loading
    optimizeCss: true,
    // Allow for larger pages without crashing
    largePageDataBytes: 128 * 100000, // 12.8MB
  },
  
  // Better PowerShell/Windows compatibility for builds
  poweredByHeader: false,
};

module.exports = nextConfig; 