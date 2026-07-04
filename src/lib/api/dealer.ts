import { apiFetch, type ApiResponse } from "./fetcher";
import { sanitize } from "@/lib/sanitize";
import type { ContentMediaData } from "@/types/content-media";
import type { AccordionItem } from "@/components/ui/Accordion/Accordion.types";

// ─── Raw API shape ────────────────────────────────────────────────────────────

type DealerApiResponse = {
  content: {
    banner_section: {
      title: string;
      sub_title: string;
      desc: string;
      image: string;
      button_text: string;
      button_link: string;
    };
    benefits_section: {
      title: string;
      sub_title: string;
      items: { image: string; title: string; desc: string }[];
    };
    cta_section: {
      title: string;
      sub_title: string;
      button_text: string;
      button_link: string;
    };
    faqs_section: {
      title: string;
      sub_title: string;
      desc: string;
      items: { title: string; desc: string }[];
    };
  };
};

// ─── Transformed shape ────────────────────────────────────────────────────────

export type DealerPageData = {
  banner: ContentMediaData;
  benefits: {
    eyebrow: string;
    title: string;
    items: { icon: string; title: string; description: string }[];
  };
  cta: {
    eyebrow: string;
    title: string;
    button: { label: string; href: string };
  };
  faq: {
    eyebrow: string;
    heading: string;
    description: string;
    items: AccordionItem[];
  };
};

// ─── Fetcher ──────────────────────────────────────────────────────────────────

export async function getDealerPage(): Promise<DealerPageData> {
  const { data } = await apiFetch<ApiResponse<DealerApiResponse>>(
    "/pages/become-a-dealer",
    { revalidate: 3600, tags: ["dealer"] },
  );

  const b = data.content.banner_section;
  const ben = data.content.benefits_section;
  const cta = data.content.cta_section;
  const faqs = data.content.faqs_section;
  
  return {
    banner: {
      eyebrow: b.title,
      heading: b.sub_title,
      description: b.desc,
      layout: "centered",
      media: {
        type: "image",
        src: b.image,
        alt: b.sub_title,
      },
      actions: [
        {
          label: b.button_text,
          href: b.button_link,
          variant: "primary",
        },
      ],
    },

    benefits: {
      eyebrow: ben.title,
      title: ben.sub_title,
      items: ben.items.map((item) => ({
        icon: item.image,
        title: item.title,
        description: item.desc,
      })),
    },

    cta: {
      eyebrow: cta.title,
      title: cta.sub_title,
      button: { label: cta.button_text, href: cta.button_link },
    },

    faq: {
      eyebrow: faqs.title,
      heading: faqs.sub_title,
      description: faqs.desc,
      items: faqs.items.map((item) => ({
        title: item.title,
        content: sanitize(`<p>${item.desc}</p>`),
      })),
    },
  };
}
