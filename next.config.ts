import type { NextConfig } from "next";

const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["pdfkit"],   // ← This is the key fix
  },
};

export default nextConfig;
