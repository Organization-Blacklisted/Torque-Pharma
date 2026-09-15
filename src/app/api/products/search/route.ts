import { NextRequest, NextResponse } from "next/server";
import { apiFetch, type ApiResponse } from "@/lib/api/fetcher";
import type { ProductSearchResult } from "@/types/product-search";

// Laravel's /products/search does a literal substring match against the
// stored name — "Tor-Spas Tablets" only matches a query that has the dash
// in exactly the right place. Since the dash could be missing, swapped for
// a space, or vice versa, we fan out a few rewritten variants of the same
// term and merge the results, rather than sending Laravel just one query.
// Only generates extra variants when the term actually has a dash or space
// in it, so a plain single-word search still costs exactly one request.
function buildQueryVariants(term: string): string[] {
  const variants = new Set<string>([term]);
  if (term.includes("-")) {
    variants.add(term.replace(/-/g, " "));
    variants.add(term.replace(/-/g, ""));
  }
  if (term.includes(" ")) {
    variants.add(term.replace(/ /g, "-"));
  }
  return Array.from(variants);
}

// Proxies the browser's live search-as-you-type requests to Laravel — API_URL
// is server-only, so the client can't call the Laravel endpoint directly.
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const name = searchParams.get("name")?.trim();
  const ingredient = searchParams.get("ingredient")?.trim();
  const term = name || ingredient;

  if (!term) {
    return NextResponse.json({ success: true, data: [] });
  }

  const field = name ? "name" : "ingredient";
  const variants = buildQueryVariants(term);

  const settled = await Promise.allSettled(
    variants.map((v) =>
      apiFetch<ApiResponse<ProductSearchResult[]>>(
        `/products/search?${field}=${encodeURIComponent(v)}`,
        { revalidate: 0 }
      )
    )
  );

  // Merge in variant order (the term as typed comes first, so its matches
  // rank ahead of the dash/space rewrites) and dedupe by slug. Only a
  // total failure across every variant is a real error — one variant
  // failing shouldn't hide results the others did find.
  const merged = new Map<string, ProductSearchResult>();
  let anyFulfilled = false;
  for (const result of settled) {
    if (result.status === "fulfilled") {
      anyFulfilled = true;
      for (const product of result.value.data) {
        if (!merged.has(product.slug)) merged.set(product.slug, product);
      }
    }
  }

  if (!anyFulfilled) {
    return NextResponse.json({ success: false, data: [] }, { status: 502 });
  }

  return NextResponse.json({ success: true, data: Array.from(merged.values()) });
}
