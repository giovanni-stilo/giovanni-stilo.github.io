import type { NextConfig } from "next";


// Static export for GitHub Pages. `trailingSlash` emits /about/index.html,
// matching the URLs the Jekyll site already published.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: {
    root: process.cwd(),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
