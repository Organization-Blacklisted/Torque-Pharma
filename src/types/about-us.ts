import type { StatCardProps } from "@/components/ui/StatCard/StatCard.types";
import type { ContentMediaData } from "@/types/content-media";

export interface AboutUsOverviewData {
  heading: string;
  description: string;
  video: string;
}

export interface AboutUsPageData {
  contentMedia: ContentMediaData;
  overview: AboutUsOverviewData;
  stats: StatCardProps[];
  cta: {
    eyebrow: string;
    title: string;
    description: string;
    button: { label: string; href: string };
  };
}
