import { apiFetch, type ApiResponse } from "./fetcher";
import { toFaq } from "./faq";
import { sanitize } from "@/lib/sanitize";
import type { FaqData } from "@/types/faq";
import type { ContentMediaData } from "@/types/content-media";

// ─── Raw API shape ────────────────────────────────────────────────────────────

type AyurvedaSoapApiResponse = {
  title: string;
  seo: {
    title: string | null;
    description: string | null;
    keywords: string | null;
    index: boolean;
  };
  content: {
    asm_hero_section: {
      tag: string;
      title: string;
      desc: string;
      image: string;
      button_text: string;
      button_link: string;
    };
    asm_domestic_section: {
      image: string;
      tag: string;
      title: string;
      desc: string;
    };
    asm_capabilities_section: {
      tag: string;
      title: string;
      items: { image: string; title: string; desc: string }[];
    };
    asm_formulations_section: {
      image: string;
      tag: string;
      title: string;
      desc: string;
      button_text: string;
      button_link: string;
    };
    asm_brand_section: {
      tag: string;
      title: string;
      desc: string;
      button_text: string;
      button_link: string;
      items: { icon: string; title: string; desc: string }[];
    };
    asm_facilities_section: {
      image: string;
      tag: string;
      title: string;
      desc: string;
      button_text: string;
      button_link: string;
      items: { title: string; desc: string }[];
    };
    asm_why_section: {
      tag: string;
      title: string;
      items: { icon: string; title: string; desc: string }[];
    };
    asm_quality_section: {
      tag: string;
      title: string;
      desc: string;
      button_text: string;
      button_link: string;
      items: { text: string }[];
    };
    asm_faq_section: {
      tag: string;
      title: string;
      sub_title: string;
      items: { title: string; desc: string }[];
    };
    asm_cta_section: {
      tag: string;
      title: string;
      button_text: string;
      button_link: string;
    };
  };
};

// ─── Transformed shape ────────────────────────────────────────────────────────

export type AyurvedaSoapPageData = {
  pageTitle: string;
  seo: {
    title: string | null;
    description: string | null;
    keywords: string | null;
    index: boolean;
  };
  hero: ContentMediaData;
  domestic: ContentMediaData;
  capabilities: {
    eyebrow: string;
    title: string;
    items: { image: string; title: string; description: string }[];
  };
  formulations: ContentMediaData;
  brand: {
    eyebrow: string;
    heading: string;
    description: string;
    items: { icon: string; title: string; description: string }[];
    button?: { label: string; href: string };
  };
  facilities: {
    eyebrow: string;
    title: string;
    description: string;
    items: { image: string; title: string; description: string }[];
    button?: { label: string; href: string };
  };
  why: {
    eyebrow: string;
    title: string;
    items: { icon: string; title: string; description: string }[];
  };
  quality: {
    eyebrow: string;
    title: string;
    description: string;
    items: { text: string }[];
    button?: { label: string; href: string };
  };
  faq: FaqData;
  cta: {
    eyebrow: string;
    title: string;
    button: { label: string; href: string };
  };
};

// Collapses literal "\r\n" line breaks the CMS sometimes leaves in plain-text
// fields into a single space.
function cleanText(text: string): string {
  return text.replace(/\r?\n/g, " ").trim();
}

// The CMS desc field for asm_formulations_section embeds its "note" aside
// (the Figma design renders it as a separate left-rule/italic block, same
// treatment as the quality section's dedicated `note` field) inside a
// "<span>...</span>" rather than a field of its own — split it out here.
function splitNote(text: string): { description: string; note?: string } {
  const match = text.match(/<span>([\s\S]*?)<\/span>/);
  return {
    description: cleanText(text.replace(/<span>[\s\S]*?<\/span>/g, "")),
    note: match ? cleanText(match[1]) : undefined,
  };
}

// ─── Fetcher ──────────────────────────────────────────────────────────────────

export async function getAyurvedaSoapPage(): Promise<AyurvedaSoapPageData> {
  const { data } = await apiFetch<ApiResponse<AyurvedaSoapApiResponse>>(
    "/pages/third-party-ayurveda-soap-manufacturing-in-india",
    { revalidate: 3600, tags: ["ayurveda-soap-manufacturing"] },
  );

  const hero = data.content.asm_hero_section;
  const domestic = data.content.asm_domestic_section;
  const capabilities = data.content.asm_capabilities_section;
  const formulations = data.content.asm_formulations_section;
  const brand = data.content.asm_brand_section;
  const facilities = data.content.asm_facilities_section;
  const why = data.content.asm_why_section;
  const quality = data.content.asm_quality_section;
  const faq = data.content.asm_faq_section;
  const cta = data.content.asm_cta_section;

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

    domestic: {
      eyebrow: domestic.tag,
      heading: domestic.title,
      description: cleanText(domestic.desc),
      layout: "split-left",
      media: { type: "image", src: domestic.image, alt: domestic.title },
    },

    capabilities: {
      eyebrow: capabilities.tag,
      // ExmCapabilitiesSection renders this as sanitized HTML (shared with
      // export-manufacturing, where editors use a literal <br> to control
      // the line break) — sanitize here too even though this page's title
      // doesn't currently use one, since it now reaches dangerouslySetInnerHTML.
      title: sanitize(capabilities.title),
      items: capabilities.items.map((item) => ({
        image: item.image,
        title: item.title,
        description: item.desc,
      })),
    },

    formulations: {
      eyebrow: formulations.tag,
      heading: formulations.title,
      ...splitNote(formulations.desc),
      layout: "split-right",
      media: { type: "image", src: formulations.image, alt: formulations.title },
      actions: [{ label: formulations.button_text, href: formulations.button_link, variant: "primary" }],
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
      button: brand.button_text ? { label: brand.button_text, href: brand.button_link } : undefined,
    },

    facilities: {
      eyebrow: facilities.tag,
      title: facilities.title,
      description: cleanText(facilities.desc),
      // The API gives one shared facility photo, not one per item — reusing
      // ProductionSection (its image pane just won't change between items).
      items: facilities.items.map((item) => ({
        image: facilities.image,
        title: item.title,
        description: cleanText(item.desc),
      })),
      button: facilities.button_text
        ? { label: facilities.button_text, href: facilities.button_link }
        : undefined,
    },

    why: {
      eyebrow: why.tag,
      title: why.title,
      items: why.items.map((item) => ({
        icon: item.icon,
        title: item.title,
        description: cleanText(item.desc),
      })),
    },

    quality: {
      eyebrow: quality.tag,
      title: quality.title,
      description: cleanText(quality.desc),
      items: quality.items,
      // "#" means the CMS hasn't set a real link yet — don't ship a dead button.
      button: quality.button_text && quality.button_link !== "#"
        ? { label: quality.button_text, href: quality.button_link }
        : undefined,
    },

    faq: toFaq({ title: faq.tag, sub_title: faq.title, desc: faq.sub_title, items: faq.items }),

    cta: {
      eyebrow: cta.tag,
      title: cta.title,
      button: { label: cta.button_text, href: cta.button_link },
    },
  };
}
