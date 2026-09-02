import { cache } from "react";
import { apiFetch, type ApiResponse } from "./fetcher";
import { sanitizeRichText } from "@/lib/sanitize";
import { toFaq } from "./faq";
import type { RawFaqSection, FaqData } from "@/types/faq";

// Converts plain-text disclaimers to HTML paragraphs.
// If the API already returns HTML (starts with "<"), passes it through unchanged.
function toHtmlParagraphs(text: string): string {
  if (text.trim().startsWith("<")) return text;
  return text
    .split(/\r?\n\r?\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${p}</p>`)
    .join("");
}

// ─── Raw API shapes ───────────────────────────────────────────────────────────

interface RawSiblingCategory {
  id: number;
  name: string;
  slug: string;
}

interface RawCategoryListItem {
  id: number;
  name: string;
  // Compound — "{parent_slug}/{own_slug}" (e.g. "export/dermatology").
  // Single-category fetches (getCategoryPage) still take just the own slug.
  slug: string;
  parent_id: number | null;
  parent_name: string | null;
  parent_slug: string | null;
}

interface RawProduct {
  id: number;
  name: string;
  slug: string;
  status: string;
  featured_image: string | null;
  categories: { id: number; name: string; slug: string }[];
}

interface RawCategoryPage {
  id: number;
  name: string;
  slug: string;
  parent_id: number;
  parent_name: string;
  parent_slug: string;
  image: string | null;
  banner_image: string | null;
  medical_disclaimer: string | null;
  faqs_section: RawFaqSection;
  products: RawProduct[];
  seo: {
    title: string | null;
    description: string | null;
    keywords: string | null;
    index: boolean;
  };
}

// ─── Transformed types ────────────────────────────────────────────────────────

export interface SiblingCategory {
  id: number;
  name: string;
  slug: string;
}

export interface CategoryRoute {
  parent: string;
  slug: string;
}

export interface ProductListItem {
  id: number;
  name: string;
  slug: string;
  image: string | null;
}

export interface CategoryPageData {
  name: string;
  slug: string;
  parentSlug: string;
  image: string | null;
  bannerImage: string | null;
  medicalDisclaimer: string;
  products: ProductListItem[];
  faq: FaqData;
  seo: {
    title: string | null;
    description: string | null;
    keywords: string | null;
    index: boolean;
  };
}

// ─── Fetchers ─────────────────────────────────────────────────────────────────

export const getCategoryPage = cache(async function getCategoryPage(
  parentSlug: string,
  slug: string
): Promise<CategoryPageData> {
  // Laravel made this endpoint parent-scoped: domestic and export can now
  // share a category slug (e.g. both have "dermatology"), and the old
  // unscoped /product-categories/{slug} returned whichever had the lower
  // ID, silently ignoring which parent was meant. The unscoped form is
  // gone entirely now (404s), so parentSlug is required, not optional.
  const { data } = await apiFetch<ApiResponse<RawCategoryPage>>(
    `/product-categories/${parentSlug}/${slug}`,
    { tags: [`category-${slug}`], revalidate: 3600 }
  );

  const faqRaw = data.faqs_section;

  return {
    name: data.name,
    slug: data.slug,
    parentSlug: data.parent_slug,
    image: data.image || null,
    bannerImage: data.banner_image || null,
    medicalDisclaimer: data.medical_disclaimer ? sanitizeRichText(toHtmlParagraphs(data.medical_disclaimer)) : "",
    // Laravel's listing endpoint doesn't filter drafts itself (only the
    // single-product endpoint does) — filter here as a safety net.
    products: data.products
      .filter((p) => p.status === "published")
      .map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        image: p.featured_image,
      })),
    faq: toFaq(faqRaw),
    seo: data.seo,
  };
});

export async function getSiblingCategories(
  parentSlug: string
): Promise<SiblingCategory[]> {
  const { data } = await apiFetch<ApiResponse<RawSiblingCategory[]>>(
    `/product-categories/${parentSlug}/children`,
    { tags: [`category-children-${parentSlug}`], revalidate: 3600 }
  );
  return data;
}

// Used by generateStaticParams to discover every {parent, slug} route pair
// directly from real data instead of a hardcoded parent list — a new
// top-level category type (a third parent besides domestic/export) gets
// picked up automatically on the next build instead of silently missing
// pages. Build-time only (never called on a live request), so unlike
// getCategoryPage/getSiblingCategories above, the cache tag here isn't
// load-bearing for revalidation — a fresh build always re-fetches anyway.
export async function getAllCategoryRoutes(): Promise<CategoryRoute[]> {
  const { data } = await apiFetch<ApiResponse<RawCategoryListItem[]>>(
    "/product-categories",
    { tags: ["product-categories-list"], revalidate: 3600 }
  );

  return data
    .filter((c) => c.parent_slug != null)
    .map((c) => ({
      parent: c.parent_slug as string,
      // slug is compound ("domestic/dermatology") — take the segment after
      // the parent slug, matching what getCategoryPage expects.
      slug: c.slug.split("/").pop() ?? c.slug,
    }));
}
