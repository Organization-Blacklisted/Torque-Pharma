import { apiFetch, type ApiResponse } from "./fetcher";
import type { CountryPageData } from "@/types/country";

interface RawCountryPage {
  name: string;
  slug: string;
  seo?: {
    schema: string | null;
  };
  top_section: {
    title: string;
    sub_title: string;
    bg_image: string;
    featured_image: string;
    flag_image: string;
  };
  counter_section: {
    desc: string;
    button_text: string;
    button_link: string | null;
    pdf: string | null;
    items: { title: string; desc: string }[];
  };
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
    schema: data.seo?.schema ?? null,
    top: {
      eyebrow: data.top_section.sub_title,
      title: data.top_section.title,
      bgImage: data.top_section.bg_image,
      featuredImage: data.top_section.featured_image,
    },
    counter: {
      items: data.counter_section.items.map((item) => ({
        title: item.title,
        description: item.desc,
      })),
      description: data.counter_section.desc
        .split(/\r?\n\r?\n/)
        .map((p) => `<p>${p.trim()}</p>`)
        .join(""),
      cta: {
        label: data.counter_section.button_text,
        // Laravel serves the PDF via its own `pdf` field, separate from `button_link`
        href: data.counter_section.pdf ?? data.counter_section.button_link ?? "#",
      },
    },
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
