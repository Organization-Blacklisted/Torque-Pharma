import { cache } from "react";
import { apiFetch, type ApiResponse } from "./fetcher";
import { sanitizeRichText } from "@/lib/sanitize";
import { toFaq } from "./faq";
import type { RawFaqSection, FaqData } from "@/types/faq";
import type { AccordionItem } from "@/components/ui/Accordion/Accordion.types";

function toTitleCase(str: string): string {
  return str.toLowerCase().replace(/\b[a-z]/g, (c) => c.toUpperCase());
}

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

interface RawProduct {
  id: number;
  name: string;
  slug: string;
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
  slug: string
): Promise<CategoryPageData> {
  const { data } = await apiFetch<ApiResponse<RawCategoryPage>>(
    `/product-categories/${slug}`,
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
    products: data.products.map((p) => ({
      id: p.id,
      name: toTitleCase(p.name),
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
