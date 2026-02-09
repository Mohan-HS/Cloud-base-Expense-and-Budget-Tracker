import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Force Turbopack's root to this app directory
    // so it doesn't walk up to parent lockfiles (like in C:\Users\Dell)
    // and hit invalid node_modules symlinks in CI.
    root: __dirname,
  },
};

export default nextConfig;
