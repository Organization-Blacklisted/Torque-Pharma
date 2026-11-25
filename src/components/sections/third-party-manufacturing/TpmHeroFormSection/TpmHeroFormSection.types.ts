export interface TpmHeroFormSectionProps {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    image: string | null;
    button: { label: string; href: string; external?: boolean };
  };
  form: {
    title: string;
    subtitle: string;
    submitLabel: string;
  };
  pageName: string;
  pageUrl: string;
}
