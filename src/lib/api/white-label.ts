import { apiFetch, type ApiResponse } from "./fetcher";
import { sanitize } from "@/lib/sanitize";
import type { ContentMediaData } from "@/types/content-media";
import type { AccordionItem } from "@/components/ui/Accordion/Accordion.types";

// ─── Raw API shape ────────────────────────────────────────────────────────────

type WhiteLabelApiResponse = {
  content: {
    video_section: {
      title: string;
      sub_title: string;
      desc: string;
      video: string | null;
      video_poster: string;
      button_text: string;
      button_link: string;
      button2_text: string;
      button2_link: string;
    };
    partnering_section: {
      title: string;
      sub_title: string;
      items: { image: string; title: string; desc: string }[];
    };
    partner_section: {
      title: string;
      sub_title: string;
      desc: string;
      items: { image: string; title: string; desc: string }[];
    };
    connect_section: {
      title: string;
      sub_title: string;
      image: string;
    };
    compliance_section: {
      title: string;
      sub_title: string;
      desc: string;
      items: { image: string }[];
    };
    faq_section: {
      title: string;
      sub_title: string;
      desc: string;
      items: { title: string; desc: string }[];
    };
    cta_section: {
      title: string;
      sub_title: string;
      button_text: string;
      button_link: string;
    };
  };
};

// ─── Transformed shape ────────────────────────────────────────────────────────

export type WhiteLabelPageData = {
  hero: ContentMediaData;
  partnering: {
    eyebrow: string;
    title: string;
    items: { icon: string; title: string; description: string }[];
  };
  partner: {
    eyebrow: string;
    heading: string;
    description: string;
    items: { image: string; title: string; description: string }[];
  };
  connect: {
    eyebrow: string;
    title: string;
    image: string;
  };
  compliance: {
    eyebrow: string;
    title: string;
    description: string;
    items: { image: string }[];
  };
  faq: {
    eyebrow: string;
    heading: string;
    description: string;
    items: AccordionItem[];
  };
  cta: {
    eyebrow: string;
    title: string;
    button: { label: string; href: string };
  };
};

// ─── Fetcher ──────────────────────────────────────────────────────────────────

export async function getWhiteLabelPage(): Promise<WhiteLabelPageData> {
  const { data } = await apiFetch<ApiResponse<WhiteLabelApiResponse>>(
    "/pages/white-label-manufacturing",
    { revalidate: 3600, tags: ["white-label"] },
  );

  const vs   = data.content.video_section;
  const ps   = data.content.partnering_section;
  const part = data.content.partner_section;
  const conn = data.content.connect_section;
  const comp = data.content.compliance_section;
  const faqs = data.content.faq_section;
  const cta  = data.content.cta_section;

  return {
    hero: {
      eyebrow: vs.title,
      heading: vs.sub_title,
      description: vs.desc,
      layout: "centered",
      media: vs.video
        ? {
            type: "video",
            sources: [{ src: vs.video, type: "video/mp4" as const }],
            poster: vs.video_poster,
          }
        : {
            type: "image",
            src: vs.video_poster,
            alt: vs.sub_title,
          },
      actions: [
        { label: vs.button_text, href: vs.button_link, variant: "primary" },
        { label: vs.button2_text, href: vs.button2_link, variant: "outline-dark" },
      ],
    },

    partnering: {
      eyebrow: ps.title,
      title: ps.sub_title,
      items: ps.items.map((item) => ({
        icon: item.image,
        title: item.title,
        description: item.desc,
      })),
    },

    partner: {
      eyebrow: part.title,
      heading: part.sub_title,
      description: part.desc,
      items: part.items.map((item) => ({
        image: item.image,
        title: item.title,
        description: item.desc,
      })),
    },

    connect: {
      eyebrow: conn.title,
      title: conn.sub_title,
      image: conn.image,
    },

    compliance: {
      eyebrow: comp.title,
      title: comp.sub_title,
      description: comp.desc,
      items: comp.items.map((item) => ({ image: item.image })),
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

    cta: {
      eyebrow: cta.title,
      title: cta.sub_title,
      button: { label: cta.button_text, href: cta.button_link },
    },
  };
}
