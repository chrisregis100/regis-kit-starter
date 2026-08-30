import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["pg"],
  transpilePackages: ["@rk-kit/ui"],
};

export default nextConfig;
