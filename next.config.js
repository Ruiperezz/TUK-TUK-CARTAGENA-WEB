/** @type {import('next').NextConfig} */

// CSP is generated per-request in middleware.js with a unique nonce (no unsafe-inline).
// Only static security headers live here.
const SECURITY_HEADERS = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(self), fullscreen=(self)",
  },
];

const nextConfig = {
  reactStrictMode: true,

  async headers() {
    return [{ source: "/(.*)", headers: SECURITY_HEADERS }];
  },

  images: { remotePatterns: [] },

  experimental: {},

  poweredByHeader: false,
};

export default nextConfig;
