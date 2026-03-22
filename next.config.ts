import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    // Self-hosted Docker: /_next/image often returns 400 (optimizer internal fetch +
    // sharp/Alpine quirks). Serve /public images directly; quality tradeoff is fine here.
    unoptimized: true,
  },
};

export default nextConfig;
