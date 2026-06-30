import type { BlogPost } from "@/types/blog";

export interface BlogsSectionProps {
  data: { posts: BlogPost[] };
  className?: string;
}
