export interface ProductionItem {
  image: string;
  title: string;
  description: string;
}

export interface ProductionSectionProps {
  eyebrow: string;
  title: string;
  description: string;
  items: ProductionItem[];
  className?: string;
}
