/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" }, // Google profile pics
      { protocol: "https", hostname: "**.googleusercontent.com" },
    ],
    unoptimized: false,
  },
}

export default nextConfig
