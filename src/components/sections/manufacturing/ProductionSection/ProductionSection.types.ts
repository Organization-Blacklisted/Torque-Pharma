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
  /** How the desktop accordion switches items — click-to-select (default) or hover, reverting to the first item on mouse-leave. */
  trigger?: "click" | "hover";
  /** Which side the image panel sits on at the desktop (md+) two-column layout. Defaults to "right". */
  imagePosition?: "left" | "right";
  className?: string;
}
