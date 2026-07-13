import { apiFetch } from "./fetcher";
import type { NewsItem } from "@/types/news";

interface NewsApiResponse {
  success: boolean;
  data: NewsItem[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export async function getNews(): Promise<NewsItem[]> {
  const res = await apiFetch<NewsApiResponse>("/news", {
    revalidate: 3600,
    tags: ["news"],
  });
  return res.data;
}
