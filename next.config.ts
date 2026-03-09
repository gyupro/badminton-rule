import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/badminton-rule",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
