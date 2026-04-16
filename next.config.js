/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
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
    ];
  },
  async redirects() {
    return [
      { source: "/kiraya", destination: "/bambaibhada", permanent: true },
      { source: "/kiraya/:path*", destination: "/bambaibhada/:path*", permanent: true },
      { source: "/padosi", destination: "/bambaibhada", permanent: true },
      { source: "/padosi/:path*", destination: "/bambaibhada/:path*", permanent: true },
    ];
  },
};

module.exports = nextConfig;
