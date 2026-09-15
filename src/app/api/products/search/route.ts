import { NextRequest, NextResponse } from "next/server";
import { apiFetch, type ApiResponse } from "@/lib/api/fetcher";
import type { ProductSearchResult } from "@/types/product-search";

// Proxies the browser's live search-as-you-type requests to Laravel — API_URL
// is server-only, so the client can't call the Laravel endpoint directly.
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const name = searchParams.get("name")?.trim();
  const ingredient = searchParams.get("ingredient")?.trim();

  if (!name && !ingredient) {
    return NextResponse.json({ success: true, data: [] });
  }

  const query = name
    ? `name=${encodeURIComponent(name)}`
    : `ingredient=${encodeURIComponent(ingredient!)}`;

  try {
    const { data } = await apiFetch<ApiResponse<ProductSearchResult[]>>(
      `/products/search?${query}`,
      { revalidate: 0 }
    );
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, data: [] }, { status: 502 });
  }
}
