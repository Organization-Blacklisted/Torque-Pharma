export interface BrandShowcaseItem {
  badge: string;
  logo: string;
  featuredImage: string;
  ctaLabel: string;
  href: string;
}

export interface TorqueLineupUpdatedData {
  eyebrow: string;
  heading: string;
  description: string;
  items: BrandShowcaseItem[];
}
