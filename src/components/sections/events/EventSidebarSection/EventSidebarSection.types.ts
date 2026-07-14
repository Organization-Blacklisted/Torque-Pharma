import type { Event } from "@/types/event";
import type { NewsItem } from "@/types/news";

export interface EventSidebarSectionProps {
  upcomingEvents: Event[];
  latestNews: NewsItem[];
  className?: string;
}
