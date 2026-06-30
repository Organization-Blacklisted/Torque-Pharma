import type { StatCardProps } from "@/components/ui/StatCard/StatCard.types";
import type { VideoSource } from "@/components/ui/VideoBackground/VideoBackground";
import type { TherapeuticAreasData } from "@/types/therapeutic-areas";

export interface StatsMediaData {
  eyebrow: string;
  title: string;
  description: string;
  stats: StatCardProps[][]; // one array per card slot — each slot rotates through its own items independently
  media: { sources: VideoSource[]; poster?: string };
  card: {
    title: string;
    description: string;
    cta?: { label: string; href: string };
  };
  footer?: { label: string; href: string };
}

export interface HomepageData {
  therapeuticAreas: TherapeuticAreasData;
}
