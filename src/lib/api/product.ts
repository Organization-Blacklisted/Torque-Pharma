import { cache } from "react";
import { apiFetch, type ApiResponse } from "./fetcher";
import { sanitizeRichText } from "@/lib/sanitize";

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
  };
}

// ─── Fetcher ──────────────────────────────────────────────────────────────────

export const getProduct = cache(async function getProduct(slug: string): Promise<ProductDetailData> {
  const { data } = await apiFetch<ApiResponse<RawProduct>>(`/products/${slug}`, {
    tags: [`product-${slug}`],
    revalidate: 3600,
  });

  return {
    name: data.name,
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
    },
  };
});
