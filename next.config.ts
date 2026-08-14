import type { NextConfig } from "next";

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

  // Serve one modern format (not avif+webp) and cache transformed images for
  // 31 days — each extra format/width variant is its own billed Vercel image
  // transformation, and these banners/photos rarely change.
  images: {
    formats: ["image/webp"],
    minimumCacheTTL: 2678400,
    // Two real hosts currently serve images: the old shared-hosting backend and
    // the new AWS-hosted one. Hardcoded rather than derived from CDN_URL — that
    // env var wasn't reliably propagating on the AWS deployment, silently
    // falling back to the old host and rejecting every new-host image.
    remotePatterns: [
      { protocol: "https", hostname: "blacklistedagency.com", pathname: "/**" },
      { protocol: "https", hostname: "backend.torquepharma.com", pathname: "/**" },
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
