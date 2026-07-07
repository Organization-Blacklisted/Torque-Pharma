export interface DirectorateItem {
  image: string;
  title: string;
  designation: string;
  about: string;
  experts: { text: string }[];
}

export interface ExecutiveDirectorateSectionProps {
  title: string;
  items: DirectorateItem[];
  className?: string;
}
