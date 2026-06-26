export interface ImpactTab {
  slug: string;
  label: string;
  image: { src: string; alt: string };
  title: string;
  description: string;
}

export interface HomeImpactData {
  eyebrow: string;
  heading: string;
  headingBold: string;
  tabs: ImpactTab[];
}
