export interface CountryTopData {
  eyebrow: string;
  title: string;
  bgImage: string;
  featuredImage: string;
}

export interface CountryCounterItem {
  title: string;
  description: string;
}

export interface CountryCounterData {
  items: CountryCounterItem[];
  description: string;
  cta: { label: string; href: string };
}

export interface CountryEdgeItem {
  icon: string;
  title: string;
  description: string;
}

export interface CountryEdgeData {
  eyebrow: string;
  heading: string;
  cta: { label: string; href: string };
  items: CountryEdgeItem[];
}

export interface CountryFormData {
  eyebrow: string;
  heading: string;
  image: string;
}

export interface CountryPageData {
  name: string;
  slug: string;
  top: CountryTopData;
  counter: CountryCounterData;
  edge: CountryEdgeData;
  form: CountryFormData;
}
