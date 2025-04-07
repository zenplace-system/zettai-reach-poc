import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // ビルド時の型チェックをスキップします
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
