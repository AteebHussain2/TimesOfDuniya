import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.gravatar.com" },
      { protocol: "https", hostname: "images.clerk.dev" },
      { protocol: "https", hostname: "ik.imagekit.io" },
    ],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    // ignoreDuringBuilds: true,
  },
};

export default nextConfig;
