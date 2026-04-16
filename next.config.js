/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    // Content-Security-Policy is whitelist-style. Update `frame-src` if a new
    // iframed origin is added. `'unsafe-inline'` for style-src is required by
    // Next.js + Tailwind's inlined critical CSS.
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://*.vercel-insights.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://abacus-eight-kappa.vercel.app https://*.vercel-insights.com https://vitals.vercel-insights.com",
      // Allow framing only the Agdam Bagdam SPA. Nothing else can be iframed.
      "frame-src 'self' https://abacus-eight-kappa.vercel.app",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      "upgrade-insecure-requests",
    ].join("; ");

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Content-Security-Policy", value: csp },
          {
            key: "Permissions-Policy",
            value: [
              "camera=()",
              "microphone=()",
              "geolocation=()",
              "payment=()",
              "usb=()",
              "interest-cohort=()",
            ].join(", "),
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/agdambagdam/api/:path*",
        destination: "https://abacus-eight-kappa.vercel.app/api/:path*",
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
