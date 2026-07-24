import { apiFetch, type ApiResponse } from "./fetcher";
import { normalizeDescription, slugify } from "./utils";
import { sanitizeRichText } from "@/lib/sanitize";
import type { NewsItem, NewsDetail, NewsContentBlock } from "@/types/news";

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

type RawContentBlock = Omit<NewsContentBlock, "id" | "description"> & {
  description: string | null;
};

type RawNewsDetail = Omit<NewsDetail, "content_blocks"> & {
  content_blocks: RawContentBlock[];
};

export async function getNews(): Promise<NewsItem[]> {
  const res = await apiFetch<NewsApiResponse>("/news", {
    revalidate: 3600,
    tags: ["news"],
  });
  return res.data;
}

export async function getNewsDetail(slug: string): Promise<NewsDetail> {
  const { data } = await apiFetch<ApiResponse<RawNewsDetail>>(`/news/${slug}`, {
    revalidate: 3600,
    tags: [`news-${slug}`, "news"],
  });

  return {
    ...data,
    description: sanitizeRichText(normalizeDescription(data.description)),
    content_blocks: data.content_blocks.map((block) => ({
      ...block,
      id: slugify(block.title),
      description: block.description ? sanitizeRichText(normalizeDescription(block.description)) : null,
    })),
  };
}
