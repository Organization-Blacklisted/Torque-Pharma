import type { NextConfig } from "next";

const cdnHostname = process.env.CDN_URL
  ? new URL(process.env.CDN_URL).hostname
  : "blacklistedagency.com";

const nextConfig: NextConfig = {
  poweredByHeader: false,

  // Server Actions default to a 1MB body limit. The career application form
  // sends a resume as base64 (~33% larger than the raw file) alongside a few
  // small text fields — a 15MB resume becomes ~20MB encoded, so the limit
  // must be raised well above that.
  experimental: {
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },

  // TEMPORARY: Vercel's image-optimization quota is exhausted (402 on every
  // /_next/image request, breaking every image on the site). unoptimized:true
  // bypasses that pipeline entirely — images load at original size/format
  // straight from the source. Revert once the plan/quota is sorted; this
  // formats config is what to restore.
  // formats: ["image/avif", "image/webp"],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: cdnHostname,
        pathname: "/projects/torque-main-backend/**",
      },
    ],
  },

  // HTTP response headers applied to every route
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Stops browsers from guessing the content-type (prevents MIME-sniffing attacks)
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Blocks the site from being embedded in an iframe (clickjacking protection)
          { key: "X-Frame-Options", value: "DENY" },
          // Controls how much referrer info is sent when clicking outbound links
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Tells browsers to only connect via HTTPS for the next year (once live on HTTPS)
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          // Disables browser features not needed by this site
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        // Font files never change (versioned by Next.js build hash) — cache for 1 year
        source: "/fonts/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Static assets (SVGs, images in /public) — cache for 1 week, revalidate
        source: "/:path*\\.(svg|ico|png|jpg|jpeg|webp|avif|woff2)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" },
        ],
      },
    ];
  },
};

export default nextConfig;
