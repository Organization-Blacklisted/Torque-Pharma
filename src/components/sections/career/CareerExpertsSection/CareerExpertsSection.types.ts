export interface CareerExpertItem {
  name: string;
  designation: string;
  about: string;
  posterImage: string;
  video: string | null;
}

export interface CareerExpertsSectionProps {
  eyebrow: string;
  heading: string;
  items: CareerExpertItem[];
  className?: string;
}
