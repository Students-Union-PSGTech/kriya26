import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mma.prnewswire.com',
      },
      {
        protocol: 'https',
        hostname: 'kriyabackend.psgtech.ac.in',
        pathname: '/api/auth/files/**',
      },
    ],
  },
};

export default nextConfig;
