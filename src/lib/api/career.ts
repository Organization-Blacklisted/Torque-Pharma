import { apiFetch, type ApiResponse } from "./fetcher";

// ─── Raw API types ────────────────────────────────────────────────────────────

interface RawCareerPage {
  content: {
    faq_section: {
      title: string;
      sub_title: string;
      items: { title: string; desc: string }[];
    };
  };
}

// ─── Transformed types ────────────────────────────────────────────────────────

export interface CareerFaqData {
  heading: string;
  subTitle: string;
  items: { title: string; content: string }[];
}

export interface CareerPageData {
  faq: CareerFaqData;
}

// ─── Fetcher ──────────────────────────────────────────────────────────────────

export async function getCareerPage(): Promise<CareerPageData> {
  const { data: raw } = await apiFetch<ApiResponse<RawCareerPage>>("/pages/career", {
    tags: ["career"],
    revalidate: 3600,
  });

  const faqRaw = raw.content.faq_section;

  return {
    faq: {
      heading: faqRaw.title,
      subTitle: faqRaw.sub_title,
      items: faqRaw.items.map((item) => ({
        title: item.title,
        content: item.desc,
      })),
    },
  };
}
