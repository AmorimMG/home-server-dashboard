import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [ {
      protocol: 'https',
      hostname: 'cdn.discordapp.com'
    },
    {
      protocol: 'https',
      hostname: 'i.scdn.co',
    },
    {
      protocol: 'https',
      hostname: 'live.staticflickr.com',
    },
    {
      protocol: 'https',
      hostname: 'api.mapbox.com',
    },
    ]
  }
};

export default nextConfig;
