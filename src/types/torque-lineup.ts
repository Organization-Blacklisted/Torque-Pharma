export interface BrandItem {
  category: string;
  pillColor: string;
  logo: string;
  productImage: string;
  description: string;
  brandName: string;
  href?: string;
}

export interface TorqueLineupData {
  eyebrow: string;
  heading: string;
  description: string;
  items: BrandItem[];
}
