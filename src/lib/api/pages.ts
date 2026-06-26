import { apiFetch, type ApiResponse } from "./fetcher";

// ─── Types ────────────────────────────────────────────────────────────────────

// Typed loosely until the Laravel block-builder schema is finalised.
// Each block has a required `type` discriminator; extend union as blocks are defined.
type CmsBlock = {
  type: string;
  [key: string]: unknown;
};

type Seo = {
  title: string | null;
  description: string | null;
  keywords: string | null;
  index: boolean;
  schema: string | null;
};

export type CmsPage = {
  id: number;
  template: string;
  title: string;
  slug: string;
  description: string;        // HTML body content
  featured_image: string | null;
  status: "published" | "draft" | string;
  seo: Seo;
  content: CmsBlock[];        // block-builder content (unused for default template)
};

// ─── Generic page fetch ───────────────────────────────────────────────────────

// Single function covers every CMS page — terms, privacy, cookies, disclaimer, etc.
// Slug must match the API exactly e.g. "terms-and-conditions", "privacy-policy"
export async function getPage(slug: string): Promise<CmsPage> {
  const res = await apiFetch<ApiResponse<CmsPage>>(`/pages/${slug}`, {
    revalidate: 3600,
    tags: [slug],
  });
  return res.data;
}
