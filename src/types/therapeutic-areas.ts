export interface TherapeuticAreaItem {
  image: string;
  title: string;
  href?: string;
}

export interface TherapeuticAreasData {
  eyebrow: string;
  heading: string;
  description: string;
  items: TherapeuticAreaItem[];
  cta: {
    label: string;
    href: string;
  };
}
