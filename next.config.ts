import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // "craft" was renamed to "projects"; its old sections were folded into the one grid.
    return [
      ...["ones-n-zeros", "scribbles", "rags"].map((s) => ({
        source: `/craft/${s}`,
        destination: "/projects",
        permanent: false,
      })),
      { source: "/craft", destination: "/projects", permanent: false },
      { source: "/craft/:path*", destination: "/projects/:path*", permanent: false },
    ];
  },
};

export default nextConfig;
