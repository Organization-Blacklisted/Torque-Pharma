import { apiFetch, type ApiResponse } from "./fetcher";
import type { BlogPost } from "@/types/blog";

const STORAGE_BASE = process.env.API_URL!.replace(/\/api$/, "/storage");

type RawBlogPost = Omit<BlogPost, "featured_image"> & {
  featured_image: string;
};

export async function getBlogs(): Promise<BlogPost[]> {
  const { data } = await apiFetch<ApiResponse<RawBlogPost[]>>("/blogs", {
    revalidate: 3600,
    tags: ["blogs"],
  });

  return data
    .filter((post) => post.status === "published")
    .map((post) => ({
      ...post,
      featured_image: post.featured_image.startsWith("http")
        ? post.featured_image
        : `${STORAGE_BASE}/${post.featured_image}`,
      plain_description: post.description.replace(/<[^>]*>/g, ""),
    }));
}

// Fetches a small slice of recent posts for the "Related Posts" section.
// Uses per_page to avoid pulling the entire catalog — requires Laravel to
// support the ?per_page query param (standard Laravel pagination).
export async function getRelatedBlogs(excludeSlug: string, limit = 3): Promise<BlogPost[]> {
  const { data } = await apiFetch<ApiResponse<RawBlogPost[]>>(`/blogs?per_page=${limit + 1}`, {
    revalidate: 3600,
    tags: ["blogs"],
  });

  return data
    .filter((post) => post.status === "published" && post.slug !== excludeSlug)
    .slice(0, limit)
    .map((post) => ({
      ...post,
      featured_image: post.featured_image.startsWith("http")
        ? post.featured_image
        : `${STORAGE_BASE}/${post.featured_image}`,
      plain_description: post.description.replace(/<[^>]*>/g, ""),
    }));
}
