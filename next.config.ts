import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Netlify's @netlify/plugin-nextjs handles the build — no standalone output needed
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'sfile.chatglm.cn' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
};

export default nextConfig;
