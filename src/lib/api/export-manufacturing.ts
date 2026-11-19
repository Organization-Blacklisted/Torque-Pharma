import { apiFetch, type ApiResponse } from "./fetcher";
import { toFaq } from "./faq";
import { sanitize } from "@/lib/sanitize";
import type { FaqData } from "@/types/faq";
import type { ContentMediaData } from "@/types/content-media";

// ─── Raw API shape ────────────────────────────────────────────────────────────

type ExportManufacturingApiResponse = {
  title: string;
  seo: {
    title: string | null;
    description: string | null;
    keywords: string | null;
    index: boolean;
  };
  content: {
    exm_hero_section: {
      tag: string;
      title: string;
      desc: string;
      image: string;
      button_text: string;
      button_link: string;
    };
    exm_partnership_section: {
      image: string;
      tag: string;
      title: string;
      desc: string;
    };
    exm_capabilities_section: {
      tag: string;
      title: string;
      items: { image: string; title: string; desc: string }[];
    };
    exm_dosage_section: {
      tag: string;
      title: string;
      desc: string;
      button_text: string;
      button_link: string;
      items: { image: string; title: string; desc: string }[];
    };
    exm_international_section: {
      tag: string;
      title: string;
      items: { icon: string; title: string; desc: string }[];
    };
    exm_process_section: {
      tag: string;
      title: string;
      desc: string;
      items: { title: string; desc: string }[];
    };
    exm_brand_section: {
      tag: string;
      title: string;
      desc: string;
      button_text: string;
      button_link: string;
      items: { icon: string; title: string; desc: string }[];
    };
    exm_quality_section: {
      tag: string;
      title: string;
      desc: string;
      note: string;
      items: { text: string }[];
    };
    exm_faq_section: {
      tag: string;
      title: string;
      sub_title: string;
      items: { title: string; desc: string }[];
    };
    exm_cta_section: {
      tag: string;
      title: string;
      button_text: string;
      button_link: string;
    };
  };
};

// ─── Transformed shape ────────────────────────────────────────────────────────

export type ExportManufacturingPageData = {
  pageTitle: string;
  seo: {
    title: string | null;
    description: string | null;
    keywords: string | null;
    index: boolean;
  };
  hero: ContentMediaData;
  partnership: ContentMediaData;
  capabilities: {
    eyebrow: string;
    title: string;
    items: { image: string; title: string; description: string }[];
  };
  dosage: {
    eyebrow: string;
    title: string;
    description: string;
    items: { image: string; name: string; capacity: string | null }[];
    cta?: { label: string; href: string };
  };
  international: {
    eyebrow: string;
    title: string;
    items: { icon: string; title: string; description: string }[];
  };
  process: {
    eyebrow: string;
    title: string;
    description: string;
    items: { title: string; description: string }[];
  };
  brand: {
    eyebrow: string;
    heading: string;
    description: string;
    items: { icon: string; title: string; description: string }[];
    button?: { label: string; href: string };
  };
  quality: {
    eyebrow: string;
    title: string;
    description: string;
    note: string;
    items: { text: string }[];
  };
  faq: FaqData;
  cta: {
    eyebrow: string;
    title: string;
    button: { label: string; href: string };
  };
};

// Collapse literal "\r\n" line breaks the CMS sometimes leaves in plain-text
// fields — React renders them as-is in a text node, but the surrounding
// whitespace reads as a typo rather than a deliberate line break anywhere
// here (unlike a heading meant to wrap, these sit mid-sentence).
function cleanText(text: string): string {
  return text.replace(/\r?\n/g, " ").trim();
}

// ─── Fetcher ──────────────────────────────────────────────────────────────────

export async function getExportManufacturingPage(): Promise<ExportManufacturingPageData> {
  const { data } = await apiFetch<ApiResponse<ExportManufacturingApiResponse>>(
    "/pages/pharmaceutical-ayurvedic-manufacturing-for-global-markets",
    { revalidate: 3600, tags: ["export-manufacturing"] },
  );

  const hero = data.content.exm_hero_section;
  const partnership = data.content.exm_partnership_section;
  const capabilities = data.content.exm_capabilities_section;
  const dosage = data.content.exm_dosage_section;
  const international = data.content.exm_international_section;
  const process = data.content.exm_process_section;
  const brand = data.content.exm_brand_section;
  const quality = data.content.exm_quality_section;
  const faq = data.content.exm_faq_section;
  const cta = data.content.exm_cta_section;

  return {
    pageTitle: data.title,
    seo: data.seo,

    hero: {
      eyebrow: hero.tag,
      heading: hero.title,
      description: cleanText(hero.desc),
      layout: "split-right",
      media: { type: "image", src: hero.image, alt: hero.title },
      actions: [{ label: hero.button_text, href: hero.button_link, variant: "primary" }],
    },

    partnership: {
      eyebrow: partnership.tag,
      heading: partnership.title,
      description: cleanText(partnership.desc),
      layout: "split-left",
      media: { type: "image", src: partnership.image, alt: partnership.title },
    },

    capabilities: {
      eyebrow: capabilities.tag,
      // Sanitized (not plain text) — editors use literal <br> tags in this
      // field from the CMS to control the line break manually.
      title: sanitize(capabilities.title),
      items: capabilities.items.map((item) => ({
        image: item.image,
        title: item.title,
        description: item.desc,
      })),
    },

    dosage: {
      eyebrow: dosage.tag,
      title: dosage.title,
      description: dosage.desc,
      items: dosage.items.map((item) => ({
        image: item.image,
        name: item.title,
        capacity: cleanText(item.desc),
      })),
      cta: dosage.button_text
        ? { label: dosage.button_text, href: dosage.button_link }
        : undefined,
    },

    international: {
      eyebrow: international.tag,
      title: international.title,
      items: international.items.map((item) => ({
        icon: item.icon,
        title: item.title,
        description: cleanText(item.desc),
      })),
    },

    process: {
      eyebrow: process.tag,
      title: process.title,
      description: process.desc,
      items: process.items.map((item) => ({
        title: item.title,
        description: cleanText(item.desc),
      })),
    },

    brand: {
      eyebrow: brand.tag,
      heading: brand.title,
      description: cleanText(brand.desc),
      items: brand.items.map((item) => ({
        icon: item.icon,
        title: item.title,
        description: item.desc,
      })),
      button: brand.button_text
        ? { label: brand.button_text, href: brand.button_link }
        : undefined,
    },

    quality: {
      eyebrow: quality.tag,
      title: quality.title,
      description: cleanText(quality.desc),
      note: quality.note,
      items: quality.items,
    },

    faq: toFaq({ title: faq.tag, sub_title: faq.title, desc: faq.sub_title, items: faq.items }),

    cta: {
      eyebrow: cta.tag,
      title: cta.title,
      button: { label: cta.button_text, href: cta.button_link },
    },
  };
}
