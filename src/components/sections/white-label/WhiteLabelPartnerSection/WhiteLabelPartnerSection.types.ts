export interface PartnerItem {
  image: string;
  title: string;
  description: string;
}

export interface WhiteLabelPartnerSectionProps {
  eyebrow: string;
  heading: string;
  description: string;
  items: PartnerItem[];
  className?: string;
}
