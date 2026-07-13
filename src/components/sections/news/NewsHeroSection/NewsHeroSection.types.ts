import type { NewsItem } from "@/types/news";

export interface NewsHeroSectionProps {
  featured: NewsItem | null;
  editorsPicks: NewsItem[];
  className?: string;
}
