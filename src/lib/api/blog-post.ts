import { cache } from "react";
import { apiFetch, type ApiResponse } from "./fetcher";
import { normalizeDescription, slugify } from "./utils";
import { sanitize, sanitizeRichText } from "@/lib/sanitize";
import type { BlogPostDetail, BlogPostContentSection } from "@/types/blog";

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
    description: sanitizeRichText(normalizeDescription(section.description)),
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
