import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["media.licdn.com"],
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
