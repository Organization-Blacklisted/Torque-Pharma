export interface FeatureGridSectionProps {
  eyebrow: string;
  title: string;
  items: { icon: string; title: string; description: string }[];
  className?: string;
  /** Below 450px, render the cards as a horizontal swipe slider (opt-in per usage). */
  mobileSlider?: boolean;
}
