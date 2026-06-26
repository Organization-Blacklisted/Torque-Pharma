import type { ContentMediaData } from "@/types/content-media";

export interface BoardOfDirectorsPageData {
  contentMedia: ContentMediaData;
  cta: {
    eyebrow: string;
    title: string;
    button: { label: string; href: string };
  };
}
