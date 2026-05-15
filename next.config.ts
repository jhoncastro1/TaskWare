import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rbqamxobhyrgthtavxbe.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/avatars/*',
      },
      {
        protocol: 'https',
        hostname: 'khnrgubqoeyzomkxaerp.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/avatars/*',
      },
    ],
  }
};

export default nextConfig;
