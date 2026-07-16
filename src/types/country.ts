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
  edge: CountryEdgeData;
  form: CountryFormData;
}
