export interface FeatureGridSectionProps {
  eyebrow: string;
  title: string;
  description?: string;
  /** Header alignment. Defaults to "center". */
  align?: "left" | "center";
  items: { icon: string; title: string; description: string }[];
  /** Rendered as a centered button below the grid. */
  button?: { label: string; href: string };
  className?: string;
  /** Below 450px, render the cards as a horizontal swipe slider (opt-in per usage). */
  mobileSlider?: boolean;
}
