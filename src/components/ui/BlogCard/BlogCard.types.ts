import type { BlogCategory } from "@/types/blog";

export interface BlogCardProps {
  slug: string;
  title: string;
  featured_image: string | null;
  category?: BlogCategory;
  className?: string;
}
