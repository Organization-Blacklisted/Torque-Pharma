import { apiFetch, type ApiResponse } from "./fetcher";
import { toFaq } from "./faq";
import { sanitize } from "@/lib/sanitize";
import type { FaqData } from "@/types/faq";

// ─── Raw API shape ────────────────────────────────────────────────────────────

type ThirdPartyManufacturingApiResponse = {
  title: string;
  seo: {
    title: string | null;
    description: string | null;
    keywords: string | null;
    index: boolean;
  };
  content: {
    tpm_hero_section: {
      tag: string;
      title: string;
      desc: string;
      image: string | null;
      button_text: string;
      button_link: string;
    };
    tpm_form_section: {
      title: string;
      sub_title: string;
      button_text: string;
      requirement_options: { label: string }[];
    };
    tpm_partnership_section: {
      image: string;
      tag: string;
      title: string;
      desc: string;
    };
    tpm_capabilities_section: {
      tag: string;
      title: string;
      items: { image: string; title: string; desc: string; button_text: string; button_link: string }[];
    };
    tpm_white_label_section: {
      tag: string;
      title: string;
      desc: string;
      button_text: string;
      button_link: string;
      items: { icon: string; title: string; desc: string }[];
    };
    tpm_values_section: {
      tag: string;
      title: string;
      items: { icon: string; title: string; desc: string }[];
    };
    tpm_production_section: {
      tag: string;
      title: string;
      desc: string;
      button_text: string;
      file: string | null;
      items: { image: string; title: string; value: string }[];
    };
    tpm_process_section: {
      tag: string;
      title: string;
      desc: string;
      items: { title: string; desc: string }[];
    };
    tpm_quality_section: {
      tag: string;
      title: string;
      desc: string;
      button_text: string;
      button_link: string;
      items: { text: string }[];
    };
    tpm_faq_section: {
      tag: string;
      title: string;
      sub_title: string;
      items: { title: string; desc: string }[];
    };
    tpm_cta_section: {
      tag: string;
      title: string;
      button_text: string;
      button_link: string;
    };
  };
};

// ─── Transformed shape ────────────────────────────────────────────────────────

export type ThirdPartyManufacturingPageData = {
  pageTitle: string;
  seo: {
    title: string | null;
    description: string | null;
    keywords: string | null;
    index: boolean;
  };
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    image: string | null;
    button: { label: string; href: string; external?: boolean };
  };
  form: {
    title: string;
    subtitle: string;
    submitLabel: string;
  };
  partnership: {
    eyebrow: string;
    heading: string;
    description: string;
    layout: "split-left";
    media: { type: "image"; src: string; alt: string };
  };
  capabilities: {
    eyebrow: string;
    title: string;
    items: {
      image: string;
      title: string;
      description: string;
      button?: { label: string; href: string };
    }[];
  };
  whiteLabel: {
    eyebrow: string;
    heading: string;
    description: string;
    items: { icon: string; title: string; description: string }[];
    button?: { label: string; href: string };
  };
  values: {
    eyebrow: string;
    title: string;
    items: { icon: string; title: string; description: string }[];
  };
  production: {
    eyebrow: string;
    title: string;
    description: string;
    items: { image: string; name: string; capacity: string | null }[];
    cta?: { label: string; href: string; external?: boolean };
  };
  process: {
    eyebrow: string;
    title: string;
    description: string;
    items: { title: string; description: string }[];
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

// Collapses literal "\r\n" line breaks the CMS sometimes leaves in plain-text fields.
function cleanText(text: string): string {
  return text.replace(/\r?\n/g, " ").trim();
}

// The CMS can point a button at either an internal page route or a direct
// file download (e.g. the hero button currently links to a PDF brochure
// instead of the original "discuss requirements" anchor) — detect file
// links so they open in a new tab instead of navigating away from the site.
function isFileLink(href: string): boolean {
  return /\.(pdf|docx?|xlsx?|pptx?|zip)$/i.test(href);
}

// ─── Fetcher ──────────────────────────────────────────────────────────────────

export async function getThirdPartyManufacturingPage(): Promise<ThirdPartyManufacturingPageData> {
  const { data } = await apiFetch<ApiResponse<ThirdPartyManufacturingApiResponse>>(
    "/pages/third-party-manufacturing",
    { revalidate: 3600, tags: ["third-party-manufacturing"] },
  );

  const hero = data.content.tpm_hero_section;
  const form = data.content.tpm_form_section;
  const partnership = data.content.tpm_partnership_section;
  const capabilities = data.content.tpm_capabilities_section;
  const whiteLabel = data.content.tpm_white_label_section;
  const values = data.content.tpm_values_section;
  const production = data.content.tpm_production_section;
  const process = data.content.tpm_process_section;
  const quality = data.content.tpm_quality_section;
  const faq = data.content.tpm_faq_section;
  const cta = data.content.tpm_cta_section;

  return {
    pageTitle: data.title,
    seo: data.seo,

    hero: {
      eyebrow: hero.tag,
      title: hero.title,
      description: cleanText(hero.desc),
      image: hero.image,
      button: {
        label: hero.button_text,
        href: hero.button_link,
        external: isFileLink(hero.button_link),
      },
    },

    form: {
      title: form.title,
      subtitle: form.sub_title,
      submitLabel: form.button_text,
    },

    partnership: {
      eyebrow: partnership.tag,
      heading: sanitize(partnership.title),
      description: cleanText(partnership.desc),
      layout: "split-left",
      media: { type: "image", src: partnership.image, alt: partnership.tag },
    },

    capabilities: {
      eyebrow: capabilities.tag,
      title: sanitize(capabilities.title),
      // The CMS button_link for both items is still the "#" placeholder, but
      // unlike other dead-link buttons on this page, both real destinations
      // already exist as of yesterday's build — point at them directly
      // rather than hiding the button, matching on title since item order
      // isn't guaranteed.
      items: capabilities.items.map((item) => {
        const title = item.title.toLowerCase();
        const knownHref = title.includes("export")
          ? "/export-manufacturing-pharma-ayurveda"
          : title.includes("ayurveda") || title.includes("soap")
            ? "/ayurveda-soap-manufacturing"
            : null;
        const href = item.button_link !== "#" ? item.button_link : knownHref;
        return {
          image: item.image,
          title: item.title,
          description: item.desc,
          button: item.button_text && href ? { label: item.button_text, href } : undefined,
        };
      }),
    },

    whiteLabel: {
      eyebrow: whiteLabel.tag,
      heading: sanitize(whiteLabel.title),
      description: cleanText(whiteLabel.desc),
      items: whiteLabel.items.map((item) => ({
        icon: item.icon,
        title: item.title,
        description: item.desc,
      })),
      // Jumps to the enquiry form already built into this page's own hero
      // instead of the CMS's button_link (currently "/contact-us") — the
      // page doesn't need to send the visitor elsewhere for this.
      button: whiteLabel.button_text
        ? { label: whiteLabel.button_text, href: "#tpm-enquiry-form" }
        : undefined,
    },

    values: {
      eyebrow: values.tag,
      title: sanitize(values.title),
      items: values.items.map((item) => ({
        icon: item.icon,
        title: item.title,
        description: cleanText(item.desc),
      })),
    },

    production: {
      eyebrow: production.tag,
      title: production.title,
      description: cleanText(production.desc),
      items: production.items.map((item) => ({
        image: item.image,
        name: item.title,
        capacity: item.value,
      })),
      cta: production.file
        ? { label: production.button_text, href: production.file, external: true }
        : undefined,
    },

    process: {
      eyebrow: process.tag,
      title: sanitize(process.title),
      description: cleanText(process.desc),
      items: process.items.map((item) => ({
        title: item.title,
        description: cleanText(item.desc),
      })),
    },

    quality: {
      eyebrow: quality.tag,
      title: quality.title,
      description: cleanText(quality.desc),
      items: quality.items,
      button: quality.button_text
        ? { label: quality.button_text, href: "#tpm-enquiry-form" }
        : undefined,
    },

    faq: toFaq({ title: faq.tag, sub_title: faq.title, desc: faq.sub_title, items: faq.items }),

    cta: {
      eyebrow: cta.tag,
      title: sanitize(cta.title),
      // Same reasoning as whiteLabel's button above — jump to this page's own
      // enquiry form instead of the CMS's button_link ("/contact-us").
      button: { label: cta.button_text, href: "#tpm-enquiry-form" },
    },
  };
}
