import { createElement } from "react";
import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright-core";
import PdfOnlyCta from "@/components/sections/shared/PdfOnlyCta";

// Vercel's default function timeout (10s) can be tight once browser launch +
// navigation + PDF export are all counted — give it more room.
export const maxDuration = 60;

// Renders the real product page via a headless browser, strips the shared
// header/footer/website CTA out of that one throwaway tab's DOM, swaps in
// the PDF-only CTA, and exports what's left to PDF.
async function launchBrowser() {
  // Vercel's serverless functions can't run full Playwright — its bundled
  // Chromium is too large for the function size limit and the runtime is
  // missing the system libraries headless Chrome needs. @sparticuz/chromium
  // ships a slimmed build with its own bundled shared libraries, so it also
  // covers the AWS-hosted box without installing a browser there manually —
  // gated on Linux generally, not just Vercel, for exactly that reason. Local
  // dev (Windows/Mac) launches whatever Chrome is actually on the machine.
  if (process.platform === "linux") {
    const sparticuzChromium = (await import("@sparticuz/chromium")).default;
    return chromium.launch({
      args: sparticuzChromium.args,
      executablePath: await sparticuzChromium.executablePath(),
    });
  }
  return chromium.launch({ channel: "chrome" });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  // On a traditional always-running server (AWS, local dev) Playwright and
  // this route share the same process/machine, so it should reach itself via
  // localhost directly — not through whatever public hostname the original
  // request came in on (that can be a tunnel, a proxy, anything). Using
  // request.nextUrl.origin broke this behind a local tunnel: forwarded
  // headers gave "https://localhost:3000", which isn't a real endpoint.
  // On Vercel there IS no persistent localhost to dogfood — each invocation
  // is its own isolated function — so there the real request origin (which
  // Vercel's edge network sets correctly, unlike an ad hoc tunnel) is the
  // only way to reach the deployed site at all.
  const origin = process.env.VERCEL
    ? request.nextUrl.origin
    : `http://localhost:${process.env.PORT ?? 3000}`;

  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    // Match the viewport to A4's printable width (96dpi) so the page's own
    // fluid layout fills the sheet exactly — otherwise Chromium's print
    // pipeline scales the (wider, default-viewport) layout down to fit,
    // leaving a blank strip of unprinted page down one side.
    await page.setViewportSize({ width: 794, height: 1123 });
    const response = await page.goto(`${origin}/${slug}`, { waitUntil: "networkidle" });

    if (!response || response.status() === 404) {
      return NextResponse.json({ success: false, message: `No product found for "${slug}"` }, { status: 404 });
    }

    // Dynamic import (not a static one) — Next.js's build-time scanner
    // blocks a static "react-dom/server" import anywhere in a file that's
    // part of its RSC bundling graph, Route Handlers included.
    const { renderToStaticMarkup } = await import("react-dom/server");
    const ctaHtml = renderToStaticMarkup(createElement(PdfOnlyCta));

    const contentHeight = await page.evaluate(
      async ({ ctaHtml }) => {
        document.querySelector("header")?.remove();
        document.querySelector("footer")?.remove();
        document.querySelector('a[href="#main-content"]')?.remove();
        document.querySelector(".js-download-pdf-block")?.remove();
        // The site permanently reserves scrollbar space (scrollbar-gutter:
        // stable) so the live page never shifts width — irrelevant here
        // since this headless tab never shows a scrollbar, but it was
        // still eating into the printed width, leaving a blank sliver.
        document.documentElement.style.scrollbarGutter = "auto";
        const main = document.querySelector("main");
        if (main instanceof HTMLElement) {
          main.style.paddingTop = "0";
          // A little breathing room on the sides per client feedback — kept
          // as padding (not a PDF page margin) so the site's own background
          // color still fills the page edge to edge; only the content insets.
          main.style.paddingLeft = "24px";
          main.style.paddingRight = "24px";
          // Product page renders ProductDetailSection followed by a "Become
          // a Dealer" CtaSection — drop that second child and print the
          // PDF-only CTA in its place instead.
          while (main.children.length > 1) main.lastElementChild?.remove();
          main.insertAdjacentHTML("beforeend", ctaHtml);

          // Several gaps in the printed page come from different spacing
          // tokens that were never meant to match each other (page's own
          // top margin, the image→title gap, the CTA's top/bottom margins).
          // Measure the smallest — the page's real top gap — and force all
          // of them to it, so the whole document reads as one consistent
          // rhythm instead of a mix of odd, unrelated gaps.
          const topGap =
            main.firstElementChild instanceof HTMLElement
              ? parseFloat(getComputedStyle(main.firstElementChild).marginTop)
              : 0;
          if (main.lastElementChild instanceof HTMLElement) {
            main.lastElementChild.style.marginTop = `${topGap}px`;
            main.lastElementChild.style.marginBottom = `${topGap}px`;
          }
          // The product section's own bottom margin (a different, larger
          // token) sits directly above the CTA's margin-top — adjacent
          // margins collapse to whichever is larger, so that untouched
          // margin was winning and silently overriding the 50px just set
          // above. Zero it so only the CTA's own margin controls this gap.
          if (main.firstElementChild instanceof HTMLElement) {
            main.firstElementChild.style.marginBottom = "0";
          }
        }
        // The brand's custom fonts can still be swapping in at this point,
        // which reflows text height — measuring before they've settled
        // undershoots the real height and spills a near-empty page 2.
        await document.fonts.ready;
        return document.documentElement.scrollHeight;
      },
      { ctaHtml }
    );

    // One continuous page sized to the actual content height instead of
    // fixed A4 pages — this is a downloadable spec sheet, not something
    // printed on physical paper, so there's no reason to paginate it and
    // leave a block of blank space on whichever page the content runs out.
    // A small buffer guards against any last sub-pixel rounding still
    // spilling a near-empty second page.
    const pdfBuffer = await page.pdf({
      width: "794px",
      height: `${contentHeight + 24}px`,
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${slug}.pdf"`,
      },
    });
  } finally {
    await browser.close();
  }
}
