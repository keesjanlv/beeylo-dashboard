import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed 'output: export' to enable server-side rendering for Railway deployment
  // This allows API routes and secure server-side Supabase access
  images: {
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  }
};

export default nextConfig;
