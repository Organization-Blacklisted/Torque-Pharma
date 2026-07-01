export interface BuiltOnItem {
  image: string;
  title: string;
  desc: string;
}

export interface BuiltOnSectionProps {
  eyebrow: string;
  subTitle: string;
  items: BuiltOnItem[];
  className?: string;
}
