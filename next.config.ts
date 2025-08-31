import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://paisebato-production.up.railway.app/api/:path*",
      },
    ];
  },
};

export default nextConfig;
