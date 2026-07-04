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
