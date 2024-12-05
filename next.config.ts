import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Skips ESLint errors during build
  },
  typescript: {
    ignoreBuildErrors: true, // Skips TypeScript errors during build
  },
};

export default nextConfig;
