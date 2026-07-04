import { apiFetch, type ApiResponse } from "./fetcher";
import type { ContentMediaData } from "@/types/content-media";

// ─── Raw API shape ────────────────────────────────────────────────────────────

type BoardApiResponse = {
  content: {
    executive_board_section: {
      title: string;
      sub_title: string;
      desc: string;
      image: string;
      button_text: string;
      button_link: string;
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

export type BoardPageData = {
  contentMedia: ContentMediaData;
  cta: {
    eyebrow: string;
    title: string;
    button: { label: string; href: string };
  };
};

// ─── Fetcher ──────────────────────────────────────────────────────────────────

export async function getBoardPage(): Promise<BoardPageData> {
  const { data } = await apiFetch<ApiResponse<BoardApiResponse>>(
    "/pages/board-of-directors",
    { revalidate: 3600, tags: ["board-of-directors"] },
  );

  const eb  = data.content.executive_board_section;
  const cta = data.content.cta_section;

  return {
    contentMedia: {
      eyebrow: eb.title,
      heading: eb.sub_title,
      description: eb.desc,
      layout: "centered",
      media: {
        type: "image",
        src: eb.image,
        alt: eb.sub_title,
        fit: "cover",
      },
      actions: [
        { label: eb.button_text, href: eb.button_link, variant: "primary" },
      ],
    },

    cta: {
      eyebrow: cta.title,
      title: cta.sub_title,
      button: { label: cta.button_text, href: cta.button_link },
    },
  };
}
