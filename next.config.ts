import type { NextConfig } from "next";

const securityHeaders = [
  // Prevents clickjacking — no iframes allowed
  { key: "X-Frame-Options", value: "DENY" },
  // Prevents MIME type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Enables XSS protection in legacy browsers
  { key: "X-XSS-Protection", value: "1; mode=block" },
  // Restricts referrer info when navigating away
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Force HTTPS (1 year) — enable in production
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  // Content Security Policy — block inline scripts from unknown sources
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://static.cloudflareinsights.com", // Next.js requires these
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com",
      "img-src 'self' data: https://lh3.googleusercontent.com https://www.googletagmanager.com", // Google avatar
      "connect-src 'self' https://cdnjs.cloudflare.com https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  reactCompiler: true,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
