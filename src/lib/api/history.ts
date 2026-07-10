import { apiFetch, type ApiResponse } from "./fetcher";
import type { HistoryPageData } from "@/types/history";

interface RawHistoryPage {
  content: {
    hist_top_section: {
      title: string;
      sub_title: string;
      desc: string;
      image: string;
    };
    hist_journey_section: {
      title: string;
    };
  };
}

export async function getHistoryPage(): Promise<HistoryPageData> {
  const { data } = await apiFetch<ApiResponse<RawHistoryPage>>("/pages/history", {
    tags: ["history"],
    revalidate: 3600,
  });

  const c = data.content;

  return {
    top: {
      eyebrow: c.hist_top_section.title,
      heading: c.hist_top_section.sub_title,
      description: c.hist_top_section.desc,
      image: c.hist_top_section.image,
    },
    journeyLabel: c.hist_journey_section.title,
  };
}
