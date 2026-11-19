export interface WhyJoinItem {
  icon: string;
  title: string;
  description: string;
}

export interface WhyJoinSectionProps {
  eyebrow: string;
  heading: string;
  description: string;
  items: WhyJoinItem[];
  /** Rendered as a centered button below the slider. */
  button?: { label: string; href: string };
  className?: string;
}
