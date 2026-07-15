import { apiFetch, type ApiResponse } from "./fetcher";
import type { HistoryPageData } from "@/types/history";

interface RawEntry {
  bg_image: string;
  image: string;
  desc: string;
}

interface RawDate {
  date: string;
  entries: RawEntry[];
}

interface RawItem {
  title: string;
  sub_title: string;
  dates: RawDate[];
}

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
      sub_title: string;
      items: RawItem[];
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
    journey: {
      title: c.hist_journey_section.title,
      sub_title: c.hist_journey_section.sub_title,
      items: c.hist_journey_section.items,
    },
  };
}
