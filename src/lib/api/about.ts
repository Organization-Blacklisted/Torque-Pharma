import { apiFetch, type ApiResponse } from "./fetcher";
import { parseStatValue } from "./utils";
import { sanitizeRichText } from "@/lib/sanitize";
import type { ContentMediaData } from "@/types/content-media";
import type { StatCardProps } from "@/components/ui/StatCard/StatCard.types";

// ─── Raw API shape ───────────────────────────────────────────────────────────
// Mirrors the /pages/about-us response — only the fields the two API-driven
// sections (contentMedia, stats) actually use. Extend as more sections are wired up.

type AboutUsApiResponse = {
  content: {
    featured_image: string;
    title_text: string;
    sub_title: string;
    desc: string;
    company_profile: { pdf: string | null; url: string | null };
    overview_section: {
      title: string;
      desc: string;
      video: string | null;
      video_poster: string;
      text_slider: { text: string }[];
    };
    counter_section: {
      items: { count: string; text: string }[];
    };
    mission_vision_section: {
      items: { image: string; title: string; desc: string }[];
    };
    values_section: {
      title: string;
      sub_title: string;
      cta_desc: string;
      button_text: string;
      button_link: string;
      items: { icon: string; title: string; desc: string }[];
    };
    built_on_section: {
      title: string;
      sub_title: string;
      items: { image: string; title: string; desc: string }[];
    };
    code_of_conduct_mini: {
      title: string;
      sub_title: string;
      desc: string;
      button_text: string;
      button_link: string;
      pdf: string | null;
    };
    connect_section: {
      title: string;
      sub_title: string;
      image: string;
    };
  };
};

// ─── Transformed shape ────────────────────────────────────────────────────────

export type AboutUsApiData = {
  contentMedia: ContentMediaData;
  overview: {
    heading: string;
    description: string;
    video: string | null;
    videoPoster: string;
    marqueeItems: string[];
  };
  missionVision: {
    items: { image: string; title: string; desc: string }[];
  };
  values: {
    eyebrow: string;
    subTitle: string;
    items: { icon: string; title: string; desc: string }[];
    cta: { desc: string; buttonText: string; buttonLink: string };
  };
  builtOn: {
    eyebrow: string;
    subTitle: string;
    items: { image: string; title: string; desc: string }[];
  };
  stats: StatCardProps[];
  connect: {
    eyebrow: string;
    subTitle: string;
    image: string;
  };
  cta: {
    eyebrow: string;
    title: string;
    description: string;
    button: { label: string; href: string };
  };
};

// ─── Fetcher ───────────────────────────────────────────────────────────────────

export async function getAboutUsPage(): Promise<AboutUsApiData> {
  const { data } = await apiFetch<ApiResponse<AboutUsApiResponse>>("/pages/about-us", {
    revalidate: 3600,
    tags: ["about-us"],
  });

  return {
    contentMedia: {
      eyebrow: data.content.title_text,
      heading: data.content.sub_title,
      description: data.content.desc,
      layout: "split-left",
      media: {
        type: "rotating",
        src: data.content.featured_image,
        alt: data.content.title_text,
      },
      actions: [
        {
          label: "View Company Profile",
          // Laravel serves the PDF via its own `pdf` field, separate from `url`
          href: data.content.company_profile.pdf ?? data.content.company_profile.url ?? "#",
          external: (data.content.company_profile.pdf ?? data.content.company_profile.url) != null,
          variant: "primary",
        },
      ],
    },
    overview: {
      heading: data.content.overview_section.title,
      description: data.content.overview_section.desc,
      video: data.content.overview_section.video,
      videoPoster: data.content.overview_section.video_poster,
      marqueeItems: data.content.overview_section.text_slider.map((s) => s.text),
    },
    missionVision: {
      items: data.content.mission_vision_section.items.map((item) => ({
        image: item.image,
        title: item.title,
        desc: item.desc,
      })),
    },
    values: {
      eyebrow: data.content.values_section.title,
      subTitle: data.content.values_section.sub_title,
      items: data.content.values_section.items.map((item) => ({
        icon: item.icon,
        title: item.title,
        desc: item.desc,
      })),
      cta: {
        desc: data.content.values_section.cta_desc,
        buttonText: data.content.values_section.button_text,
        buttonLink: data.content.values_section.button_link,
      },
    },
    builtOn: {
      eyebrow: data.content.built_on_section.title,
      subTitle: sanitizeRichText(data.content.built_on_section.sub_title),
      items: data.content.built_on_section.items.map((item) => ({
        image: item.image,
        title: item.title,
        desc: item.desc,
      })),
    },
    stats: data.content.counter_section.items.map((item) => {
      const { value, suffix } = parseStatValue(item.count);
      return {
        value,
        suffix,
        description: item.text,
        theme: "dark" as const,
      };
    }),
    connect: {
      eyebrow: data.content.connect_section.title,
      subTitle: data.content.connect_section.sub_title,
      image: data.content.connect_section.image,
    },
    cta: {
      eyebrow: data.content.code_of_conduct_mini.title,
      title: data.content.code_of_conduct_mini.sub_title,
      description: data.content.code_of_conduct_mini.desc,
      button: {
        label: data.content.code_of_conduct_mini.button_text,
        href: data.content.code_of_conduct_mini.button_link,
      },
    },
  };
}
