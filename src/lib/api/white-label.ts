import { apiFetch, type ApiResponse } from "./fetcher";
import { toFaq } from "./faq";
import type { RawFaqSection, FaqData } from "@/types/faq";
import type { ContentMediaData } from "@/types/content-media";

// ─── Raw API shape ────────────────────────────────────────────────────────────

type WhiteLabelApiResponse = {
  content: {
    video_section: {
      title: string;
      sub_title: string;
      desc: string;
      video: string | null;
      video_poster: string;
      button_text: string | null;
      button_link: string | null;
      button2_text: string | null;
      button2_link: string | null;
    };
    scale_section: {
      title: string;
      sub_title: string;
      desc: string;
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
    white_label_section: {
      title: string;
      sub_title: string;
      desc: string;
      items: { image: string; title: string; desc: string; link: string }[];
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
    faq_section: RawFaqSection;
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
  scale: {
    eyebrow: string;
    heading: string;
    description: string;
  };
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
  productionScale: {
    eyebrow: string;
    title: string;
    description: string;
    items: { image: string; name: string; capacity: string }[];
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
  faq: FaqData;
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
  const sc   = data.content.scale_section;
  const ps   = data.content.partnering_section;
  const part = data.content.partner_section;
  const wl   = data.content.white_label_section;
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
      // Drop either button cleanly if Laravel clears its text — a removed
      // button shouldn't leave an empty/dead button behind.
      actions: [
        vs.button_text ? { label: vs.button_text, href: vs.button_link ?? "#", variant: "primary" as const } : null,
        vs.button2_text ? { label: vs.button2_text, href: vs.button2_link ?? "#", variant: "outline-dark" as const } : null,
      ].filter((action): action is NonNullable<typeof action> => action !== null),
    },

    scale: {
      eyebrow: sc.title,
      heading: sc.sub_title,
      description: sc.desc,
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

    productionScale: {
      eyebrow: wl.title,
      title: wl.sub_title,
      description: wl.desc,
      items: wl.items.map((item) => ({
        image: item.image,
        name: item.title,
        capacity: item.desc,
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

    faq: toFaq(faqs),

    cta: {
      eyebrow: cta.title,
      title: cta.sub_title,
      button: { label: cta.button_text, href: cta.button_link },
    },
  };
}
