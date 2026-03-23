import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    // Self-hosted Docker: /_next/image often returns 400 (optimizer internal fetch +
    // sharp/Alpine quirks). Serve /public images directly; quality tradeoff is fine here.
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
