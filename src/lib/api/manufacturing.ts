import { apiFetch, type ApiResponse } from "./fetcher";
import { toFaq } from "./faq";
import { parseStatValue } from "./utils";
import type { RawFaqSection, FaqData } from "@/types/faq";
import type { ContentMediaData } from "@/types/content-media";
import type { StatCardProps } from "@/components/ui/StatCard/StatCard.types";

// ─── Raw API shape ────────────────────────────────────────────────────────────

type ManufacturingApiResponse = {
  content: {
    production_section: {
      title: string;
      sub_title: string;
      desc: string;
      items: { image: string; title: string; desc: string }[];
    };
    video_section: {
      title: string;
      sub_title: string;
      desc: string;
      video: string | null;
      video_poster: string;
      button_text: string;
      button_link: string;
      pdf: string | null;
    };
    process_section: {
      title: string;
      sub_title: string;
      desc: string;
      items: { title: string; desc: string }[];
    };
    quality_driven_section: {
      title: string;
      sub_title: string;
      desc: string;
      items: { title: string; sub_title: string; desc: string }[];
    };
    certifications_section: {
      title: string;
      sub_title: string;
      desc: string;
      items: { image: string }[];
    };
    quality_assessment_section: {
      title: string;
      sub_title: string;
      items: { image: string; title: string; desc: string }[];
    };
    production_scale_section: {
      title: string;
      sub_title: string;
      desc: string;
      items: { image: string; title: string; desc: string; link: string }[];
    };
    act_with_purpose_section: {
      title: string;
      sub_title: string;
      button_text: string;
      button_link: string;
    };
    faq_section: RawFaqSection;
  };
};

// ─── Transformed shape ────────────────────────────────────────────────────────

export type ManufacturingPageData = {
  production: {
    eyebrow: string;
    title: string;
    description: string;
    items: { image: string; title: string; description: string }[];
  };
  contentMedia: ContentMediaData;
  process: {
    eyebrow: string;
    title: string;
    description: string;
    items: { title: string; description: string }[];
  };
  stats: {
    eyebrow: string;
    title: string;
    description: string;
    stats: StatCardProps[];
  };
  qualityAssessment: {
    eyebrow: string;
    title: string;
    items: { image: string; title: string; description: string }[];
  };
  certifications: {
    eyebrow: string;
    title: string;
    description: string;
    items: { image: string }[];
  };
  productionScale: {
    eyebrow: string;
    title: string;
    description: string;
    items: { image: string; name: string; capacity: string }[];
  };
  cta: {
    eyebrow: string;
    title: string;
    button: { label: string; href: string };
  };
  faq: FaqData;
};

// ─── Fetcher ──────────────────────────────────────────────────────────────────

export async function getManufacturingPage(): Promise<ManufacturingPageData> {
  const { data } = await apiFetch<ApiResponse<ManufacturingApiResponse>>(
    "/pages/manufacturing-facilities",
    { revalidate: 3600, tags: ["manufacturing"] },
  );

  const prods = data.content.production_section;
  const vs = data.content.video_section;
  const ps = data.content.process_section;
  const qds = data.content.quality_driven_section;
  const certs = data.content.certifications_section;
  const qas = data.content.quality_assessment_section;
  const pss = data.content.production_scale_section;
  const awps = data.content.act_with_purpose_section;
  const faqs = data.content.faq_section;

  return {
    production: {
      eyebrow: prods.title,
      title: prods.sub_title,
      description: prods.desc,
      items: prods.items.map((item) => ({
        image: item.image,
        title: item.title,
        description: item.desc,
      })),
    },

    contentMedia: {
      eyebrow: vs.title,
      heading: vs.sub_title,
      description: vs.desc,
      layout: "centered",
      // When the API has no video yet, render the poster as a cover image.
      // Once `video` is populated the branch flips to a video player automatically.
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
        {
          label: vs.button_text,
          // Prefer the dedicated PDF URL; fall back to the generic button link.
          href: vs.pdf ?? vs.button_link,
          variant: "primary",
        },
      ],
    },

    process: {
      eyebrow: ps.title,
      title: ps.sub_title,
      description: ps.desc,
      items: ps.items.map((item) => ({
        title: item.title,
        description: item.desc.replace(/\r\n/g, " ").trim(),
      })),
    },

    stats: {
      eyebrow: qds.title,
      title: qds.sub_title,
      description: qds.desc,
      stats: qds.items.map((item) => {
        const { value, suffix } = parseStatValue(item.sub_title);
        return {
          label: item.title,
          value,
          suffix,
          description: item.desc,
          theme: "dark" as const,
          animated: true,
        };
      }),
    },

    certifications: {
      eyebrow: certs.title,
      title: certs.sub_title,
      description: certs.desc,
      items: certs.items.map((item) => ({ image: item.image })),
    },

    qualityAssessment: {
      eyebrow: qas.title,
      title: qas.sub_title,
      items: qas.items.map((item) => ({
        image: item.image,
        title: item.title,
        description: item.desc,
      })),
    },

    productionScale: {
      eyebrow: pss.title,
      title: pss.sub_title,
      description: pss.desc,
      items: pss.items.map((item) => ({
        image: item.image,
        name: item.title,
        capacity: item.desc,
      })),
    },

    cta: {
      eyebrow: awps.title,
      title: awps.sub_title,
      button: {
        label: awps.button_text,
        href: awps.button_link,
      },
    },

    faq: toFaq(faqs),
  };
}
