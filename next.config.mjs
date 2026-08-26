/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output for Render deployment (smaller image, self-contained)
  output: "standalone",

  // Allow images from Firebase Storage and other CDNs
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "**.googleapis.com",
      },
    ],
  },

  // Disable X-Powered-By header for security
  poweredByHeader: false,
};

export default nextConfig;
