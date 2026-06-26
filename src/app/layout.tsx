import type { Metadata, Viewport } from "next";
import "./globals.css";
import { bwDarius, graphik } from "@/fonts";
import Footer from "@/components/layouts/Footer";
import Header from "@/components/layouts/Header";

export const metadata: Metadata = {
  title: {
    default: "Torque Pharma",
    template: "%s | Torque Pharma",
  },
  description: "Torque Pharma",
};

// Viewport is kept separate from metadata in Next.js 15+.
// It injects the <meta name="viewport"> tag that tells mobile browsers
// to match the device's actual pixel width instead of pretending to be
// a 980px desktop — without this, mobile browsers zoom out and your
// layout won't match what you designed. initialScale=1 prevents any
// default zoom being applied on first load.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

function getApiOrigin(): string | null {
  try {
    return process.env.API_URL ? new URL(process.env.API_URL).origin : null;
  } catch {
    return null;
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const apiOrigin = getApiOrigin();

  return (
    <html
      lang="en"
      className={`h-full antialiased ${bwDarius.variable} ${graphik.variable}`}
    >
      <head>
        {apiOrigin && <link rel="preconnect" href={apiOrigin} />}
      </head>
      <body className="min-h-full flex flex-col">
          {/* Skip-to-content — invisible until focused, first tab stop for keyboard/screen-reader users */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:font-body focus:text-body-sm focus:font-medium focus:text-white focus:shadow-lg"
          >
            Skip to main content
          </a>
          <Header />
          {/* pt accounts for fixed header: py-3 (12px) + card h-[68px] + py-3 (12px) = 92px mobile, 96px lg */}
          <main id="main-content" className="flex-1 pt-[92px] lg:pt-[96px]">{children}</main>
          <Footer />
        </body>
    </html>
  );
}