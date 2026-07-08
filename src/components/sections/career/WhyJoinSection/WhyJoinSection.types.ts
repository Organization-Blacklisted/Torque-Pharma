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
  className?: string;
}
