export interface ContactInfoItem {
  image: string;
  text: string;
  description: string;
}

export interface ContactInfoSectionProps {
  eyebrow: string;
  heading: string;
  description: string;
  items: ContactInfoItem[];
  className?: string;
}
