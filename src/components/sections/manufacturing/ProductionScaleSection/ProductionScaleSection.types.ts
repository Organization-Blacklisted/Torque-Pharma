import type { ReactNode } from "react";

export interface ProductionScaleSectionProps {
  eyebrow: string;
  title: string;
  description: string;
  items: { image: string; name: string; capacity: string | null }[];
  /** Continuously auto-scroll the cards with no arrows, instead of the default paged slider */
  autoScroll?: boolean;
  /** Hide the prev/next arrow buttons (default true) — the track stays draggable */
  showArrows?: boolean;
  /** Backed by a direct file upload — can be missing, so not guaranteed present */
  cta?: { label: string; href: string; external?: boolean };
  /** Renders in place of the CMS-driven `cta` when provided — e.g. a button that
   * opens a modal instead of navigating. The CMS `cta` label/href data is otherwise unused. */
  ctaOverride?: ReactNode;
  className?: string;
}
