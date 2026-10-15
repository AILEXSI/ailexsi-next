import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const root = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    root,
  },
  images: {
    // Artwork is fetched by the image optimizer, so the visitor's browser
    // does not contact SoundCloud until they press play.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.sndcdn.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
