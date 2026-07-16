import { apiFetch } from "./fetcher";

interface RawCountry {
  name: string;
  slug: string;
  flag_image: string;
}

interface RawCountryCategory {
  id: number;
  name: string;
  slug: string;
  countries: RawCountry[];
}

interface RawCountryCategoriesResponse {
  success: boolean;
  data: RawCountryCategory[];
}

export interface CountryItem {
  name: string;
  slug: string;
  flagImage: string;
}

export interface CountryCategory {
  name: string;
  slug: string;
  countries: CountryItem[];
}

export async function getCountryCategories(): Promise<CountryCategory[]> {
  const res = await apiFetch<RawCountryCategoriesResponse>("/country-categories", {
    tags: ["country-categories"],
    revalidate: 3600,
  });

  return res.data.map((cat) => ({
    name: cat.name,
    slug: cat.slug,
    countries: cat.countries.map((country) => ({
      name: country.name,
      slug: country.slug,
      flagImage: country.flag_image,
    })),
  }));
}
