export interface ValueItem {
  icon: string;
  title: string;
  desc: string;
}

export interface ValuesSectionProps {
  eyebrow: string;
  subTitle: string;
  items: ValueItem[];
  cta: {
    desc: string;
    buttonText: string;
    buttonLink: string;
  };
  className?: string;
}
