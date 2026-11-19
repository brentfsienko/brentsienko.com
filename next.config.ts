import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // The craft sections were folded into one grid at /craft.
    return ["ones-n-zeros", "scribbles", "rags"].map((s) => ({
      source: `/craft/${s}`,
      destination: "/craft",
      permanent: false,
    }));
  },
};

export default nextConfig;
