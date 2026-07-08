export interface OpenPositionItem {
  image: string;
  title: string;
  description: string;
}

export interface OpenPositionCenterItem {
  image: string;
}

export interface OpenPositionsSectionProps {
  eyebrow: string;
  heading: string;
  description: string;
  leftItems: OpenPositionItem[];
  centerItems: OpenPositionCenterItem[];
  rightItems: OpenPositionItem[];
  className?: string;
}
