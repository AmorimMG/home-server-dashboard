import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["cdn.discordapp.com", "i.scdn.co", "live.staticflickr.com", "api.mapbox.com"],
  }
};

export default nextConfig;
