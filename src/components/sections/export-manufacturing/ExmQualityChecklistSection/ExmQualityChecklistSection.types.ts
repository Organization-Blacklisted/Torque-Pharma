export interface ExmQualityChecklistSectionProps {
  eyebrow: string;
  title: string;
  description: string;
  note?: string;
  items: { text: string }[];
  button?: { label: string; href: string };
  className?: string;
}
