import { apiFetch, type ApiResponse } from "./fetcher";
import type { CountryPageData } from "@/types/country";

interface RawCountryPage {
  name: string;
  slug: string;
  edge_section: {
    title: string;
    sub_title: string;
    button_text: string;
    button_link: string;
    items: { image: string; title: string; desc: string }[];
  };
  form_section: {
    title: string;
    sub_title: string;
    image: string;
  };
}

export async function getCountryPage(slug: string): Promise<CountryPageData> {
  const { data } = await apiFetch<ApiResponse<RawCountryPage>>(`/countries/${slug}`, {
    tags: [`country-${slug}`],
    revalidate: 3600,
  });

  return {
    name: data.name,
    slug: data.slug,
    edge: {
      eyebrow: data.edge_section.title,
      heading: data.edge_section.sub_title,
      cta: {
        label: data.edge_section.button_text,
        href: data.edge_section.button_link,
      },
      items: data.edge_section.items.map((item) => ({
        icon: item.image,
        title: item.title,
        description: item.desc,
      })),
    },
    form: {
      eyebrow: data.form_section.title,
      heading: data.form_section.sub_title,
      image: data.form_section.image,
    },
  };
}
