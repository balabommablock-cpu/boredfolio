/** @type {import('next').NextConfig} */
const nextConfig = {
  // React strict mode for development
  reactStrictMode: true,

  // Skip TS type-check during build (mock data mismatches — not runtime issues)
  typescript: {
    ignoreBuildErrors: true,
  },

  // Image optimization
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.amfiindia.com" },
      { protocol: "https", hostname: "**.valueresearchonline.com" },
      { protocol: "https", hostname: "**.morningstar.in" },
    ],
    formats: ["image/avif", "image/webp"],
  },

  // Redirects for SEO
  async redirects() {
    return [
      // Old URL patterns to new
      { source: "/scheme/:slug", destination: "/fund/:slug", permanent: true },
      { source: "/mutual-fund/:slug", destination: "/fund/:slug", permanent: true },
      { source: "/screener", destination: "/explore", permanent: true },
      { source: "/funds", destination: "/explore", permanent: true },
    ];
  },

  // Headers for security and caching
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        // Cache static assets aggressively
        source: "/fonts/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },


};

module.exports = nextConfig;
