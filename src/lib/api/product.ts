import { cache } from "react";
import { apiFetch, type ApiResponse } from "./fetcher";
import { sanitizeRichText } from "@/lib/sanitize";
import { toTitleCase } from "./utils";

// ─── Raw API shape ────────────────────────────────────────────────────────────

interface RawProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  featured_image: string;
  gallery: string[];
  content: { title: string; description: string }[];
  categories: { id: number; name: string; slug: string }[];
  parent_categories: { id: number; name: string; slug: string }[];
  seo: {
    title: string | null;
    description: string | null;
    keywords: string | null;
    index: boolean;
    schema: string | null;
  };
}

// ─── Transformed types ────────────────────────────────────────────────────────

export interface ProductContentItem {
  title: string;
  description: string;
}

export interface ProductDetailData {
  name: string;
  slug: string;
  description: string;
  featuredImage: string | null;
  gallery: string[];
  content: ProductContentItem[];
  seo: {
    title: string | null;
    description: string | null;
    keywords: string | null;
    index: boolean;
    schema: string | null;
  };
}

interface RawProductListPage {
  current_page: number;
  last_page: number;
  data: { slug: string; status: string }[];
}

// ─── Fetchers ─────────────────────────────────────────────────────────────────

// Used by generateStaticParams so every product is pre-rendered at build
// time — without this, /[slug] has no static params, so every navigation
// is a fully dynamic server render and shows the loading fallback on every
// single click, even for a product that's been live for months. Laravel's
// /products endpoint is paginated and ignores ?per_page, so page 1 is
// fetched first to learn the page count, then the rest in parallel.
export async function getAllProductSlugs(): Promise<string[]> {
  const first = await apiFetch<ApiResponse<RawProductListPage>>("/products?page=1", {
    revalidate: 3600,
    tags: ["products"],
  });

  const rest = await Promise.all(
    Array.from({ length: first.data.last_page - 1 }, (_, i) =>
      apiFetch<ApiResponse<RawProductListPage>>(`/products?page=${i + 2}`, {
        revalidate: 3600,
        tags: ["products"],
      })
    )
  );

  return [first.data, ...rest.map((r) => r.data)]
    .flatMap((page) => page.data)
    .filter((p) => p.status === "published")
    .map((p) => p.slug);
}

export const getProduct = cache(async function getProduct(slug: string): Promise<ProductDetailData> {
  const { data } = await apiFetch<ApiResponse<RawProduct>>(`/products/${slug}`, {
    tags: [`product-${slug}`],
    revalidate: 3600,
  });

  return {
    name: toTitleCase(data.name),
    slug: data.slug,
    description: data.description,
    featuredImage: data.featured_image || null,
    gallery: data.gallery.filter(Boolean),
    content: data.content.map((item) => ({
      title: item.title,
      description: sanitizeRichText(item.description),
    })),
    seo: {
      title: data.seo.title,
      description: data.seo.description,
      keywords: data.seo.keywords,
      index: data.seo.index,
      schema: data.seo.schema,
    },
  };
});
