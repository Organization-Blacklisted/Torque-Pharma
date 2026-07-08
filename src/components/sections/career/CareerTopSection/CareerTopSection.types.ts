export interface CareerTopItem {
  image: string;
  title: string;
}

export interface CareerTopSectionProps {
  eyebrow: string;
  heading: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  items: CareerTopItem[];
  className?: string;
}
