import type { StatCardProps } from "@/components/ui/StatCard/StatCard.types";
import type { VideoSource } from "@/components/ui/VideoBackground/VideoBackground";
import type { TherapeuticAreasData } from "@/types/therapeutic-areas";
import type { TorqueLineupData } from "@/types/torque-lineup";

export interface StatsMediaData {
  eyebrow: string;
  title: string;
  description: string;
  stats: StatCardProps[];
  media: { sources: VideoSource[]; poster?: string };
  card: {
    title: string;
    description: string;
    cta?: { label: string; href: string };
  };
  footer?: { label: string; href: string };
}

export interface HomepageData {
  statsMedia: StatsMediaData;
  therapeuticAreas: TherapeuticAreasData;
  torqueLineup: TorqueLineupData;
}
