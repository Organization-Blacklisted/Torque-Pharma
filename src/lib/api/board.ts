import { apiFetch, type ApiResponse } from "./fetcher";
import type { ContentMediaData } from "@/types/content-media";

// ─── Raw API shape ────────────────────────────────────────────────────────────

type BoardApiResponse = {
  executive_board_section: {
    title: string;
    sub_title: string;
    desc: string;
    image: string;
    button_text: string;
    button_link: string;
  };
  founder_section: {
    image: string;
    title: string;
    birth_death_date: string;
    sub_title: string;
    desc: string;
  };
  director_section: {
    image: string;
    title: string;
    designation: string;
    about: string;
    desc: string;
  };
  executive_directorate: {
    title: string;
    items: {
      image: string;
      title: string;
      designation: string;
      about: string;
      experts: { text: string }[];
    }[];
  };
  cta_section: {
    title: string;
    sub_title: string;
    button_text: string;
    button_link: string;
  };
};

// ─── Transformed shape ────────────────────────────────────────────────────────

export type BoardPageData = {
  contentMedia: ContentMediaData;
  founder: {
    image: string;
    name: string;
    dates: string;
    quote: string;
    bio: string;
  };
  director: {
    image: string;
    name: string;
    designation: string;
    about: string;
    quote: string;
  };
  executiveDirectorate: {
    title: string;
    items: {
      image: string;
      title: string;
      designation: string;
      about: string;
      experts: { text: string }[];
    }[];
  };
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

  const eb   = data.executive_board_section;
  const fo   = data.founder_section;
  const dir  = data.director_section;
  const ed   = data.executive_directorate;
  const cta  = data.cta_section;

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

    founder: {
      image: fo.image,
      name: fo.title,
      dates: fo.birth_death_date,
      quote: fo.sub_title,
      bio: fo.desc,
    },

    director: {
      image: dir.image,
      name: dir.title,
      designation: dir.designation,
      about: dir.about,
      quote: dir.desc,
    },

    executiveDirectorate: {
      title: ed.title,
      items: ed.items.map((item) => ({
        image: item.image,
        title: item.title,
        designation: item.designation,
        about: item.about,
        experts: item.experts,
      })),
    },

    cta: {
      eyebrow: cta.title,
      title: cta.sub_title,
      button: { label: cta.button_text, href: cta.button_link },
    },
  };
}
