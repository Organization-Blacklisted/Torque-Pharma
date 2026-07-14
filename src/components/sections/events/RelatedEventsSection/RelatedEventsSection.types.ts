import type { Event } from "@/types/event";

export interface RelatedEventsSectionProps {
  events: Event[];
  className?: string;
  tag?: string | null | undefined;
}
