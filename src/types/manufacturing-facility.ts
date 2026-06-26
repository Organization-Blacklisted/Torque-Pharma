import type { StatCardProps } from "@/components/ui/StatCard/StatCard.types";
import type { AccordionItem } from "@/components/ui/Accordion/Accordion.types";
import type { ContentMediaData } from "@/types/content-media";

export interface ManufacturingFacilityPageData {
  contentMedia: ContentMediaData;
  stats: {
    eyebrow: string;
    title: string;
    description: string;
    stats: StatCardProps[];
  };
  cta: {
    eyebrow: string;
    title: string;
    button: { label: string; href: string };
  };
  faq: {
    eyebrow: string;
    heading: string;
    description: string;
    items: AccordionItem[];
  };
}
