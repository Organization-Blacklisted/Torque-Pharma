import { apiFetch, type ApiResponse } from "./fetcher";
import { parseStatValue } from "./utils";
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
    company_profile: { pdf: string | null; url: string };
    counter_section: {
      items: { count: string; text: string }[];
    };
  };
};

// ─── Transformed shape ────────────────────────────────────────────────────────

export type AboutUsApiData = {
  contentMedia: ContentMediaData;
  stats: StatCardProps[];
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
          label: "Download Company Profile",
          href: data.content.company_profile.url,
          variant: "primary",
        },
      ],
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
  };
}
