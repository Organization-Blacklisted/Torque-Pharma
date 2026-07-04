export interface EligibilityItem {
  title: string;
  content: { text: string }[];
}

export interface DealerEligibilitySectionProps {
  eyebrow: string;
  heading: string;
  description: string;
  items: EligibilityItem[];
  className?: string;
}
