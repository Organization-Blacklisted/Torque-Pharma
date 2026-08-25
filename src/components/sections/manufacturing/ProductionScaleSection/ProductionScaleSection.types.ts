export interface ProductionScaleSectionProps {
  eyebrow: string;
  title: string;
  description: string;
  items: { image: string; name: string; capacity: string | null }[];
  /** Continuously auto-scroll the cards with no arrows, instead of the default paged slider */
  autoScroll?: boolean;
  /** Backed by a direct file upload — can be missing, so not guaranteed present */
  cta?: { label: string; href: string; external?: boolean };
  className?: string;
}
