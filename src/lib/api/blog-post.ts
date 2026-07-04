import { cache } from "react";
import { apiFetch, type ApiResponse } from "./fetcher";
import { sanitize } from "@/lib/sanitize";
import type { BlogPostDetail, BlogPostContentSection } from "@/types/blog";

// Sections from the API are sometimes plain text, sometimes HTML, sometimes mixed
// (plain text intro followed by <ul> or <h3>). Strategy:
// - If content already starts with a block element, it's structured HTML — return as-is.
// - Otherwise split on self-contained block elements, wrap plain text segments in <p>.
function normalizeDescription(text: string): string {
  if (/^\s*<(?:p|h[1-6]|ul|ol|div|blockquote)\b/i.test(text.trim())) return text;

  const blockRe = /(<(?:h[1-6]|ul|ol|div|blockquote|table|pre)\b[\s\S]*?<\/(?:h[1-6]|ul|ol|div|blockquote|table|pre)>)/gi;

  return text
    .split(blockRe)
    .map((segment) => {
      if (/^\s*<(?:h[1-6]|ul|ol|div|blockquote|table|pre)\b/i.test(segment)) {
        return segment;
      }
      return segment
        .split(/\r?\n\r?\n/)
        .map((para) => para.trim())
        .filter(Boolean)
        .map((para) => `<p>${para.replace(/\r?\n/g, "<br>")}</p>`)
        .join("");
    })
    .join("");
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

type RawContentSection = {
  title: string;
  description: string;
};

type RawBlogPostDetail = Omit<BlogPostDetail, "content"> & {
  content: RawContentSection[];
};

export const getBlogPost = cache(async function getBlogPost(
  slug: string
): Promise<BlogPostDetail> {
  const { data } = await apiFetch<ApiResponse<RawBlogPostDetail>>(`/blogs/${slug}`, {
    revalidate: 3600,
    tags: [`blog-${slug}`],
  });

  const content: BlogPostContentSection[] = data.content.map((section) => ({
    id: slugify(section.title),
    title: section.title,
    description: normalizeDescription(section.description),
  }));

  const faq_section = data.faq_section
    ? {
        ...data.faq_section,
        items: data.faq_section.items.map((item) => ({
          ...item,
          desc: sanitize(item.desc),
        })),
      }
    : null;

  return { ...data, content, faq_section };
});
