export interface ExmCapabilitiesSectionProps {
  eyebrow: string;
  title: string;
  items: {
    image: string;
    title: string;
    description: string;
    /** Small mint text+arrow link below the description, instead of a full button. */
    button?: { label: string; href: string };
  }[];
  className?: string;
}
