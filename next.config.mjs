/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},
  images: {
    // Allow Next.js Image component to serve files uploaded to /public/uploads/
    remotePatterns: [],
    localPatterns: [{ pathname: '/uploads/**' }],
  },
  webpack: (config) => {
    config.watchOptions = {
      ...(config.watchOptions || {}),
      // Polling helps file detection on WSL-mounted filesystems.
      poll: 1000,
      aggregateTimeout: 300,
      ignored: ["**/node_modules/**", "**/.git/**", "**/.next/**"],
    }
    return config
  },
}

export default nextConfig
