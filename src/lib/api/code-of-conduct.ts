import { apiFetch, type ApiResponse } from "./fetcher";
import type { CodeOfConductData } from "@/types/code-of-conduct";

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

type RawItem = {
  title: string;
  description: string;
};

type CodeOfConductApiResponse = {
  title: string;
  description: string;
  status: string;
  content: {
    sub_title: string;
    description: string;
    overview_section: {
      overview_title: string;
      overview_list: RawItem[];
    };
  };
};

export async function getCodeOfConductPage(): Promise<CodeOfConductData> {
  const { data } = await apiFetch<ApiResponse<CodeOfConductApiResponse>>(
    "/pages/code-of-conduct",
    { revalidate: 3600, tags: ["code-of-conduct"] }
  );

  const subtitle = data.description.replace(/<[^>]+>/g, "").trim();

  return {
    title: data.title,
    subtitle,
    subTitle: data.content.sub_title,
    mdMessage: data.content.description,
    overviewTitle: data.content.overview_section.overview_title,
    items: data.content.overview_section.overview_list.map((item) => ({
      id: slugify(item.title),
      title: item.title,
      description: item.description,
    })),
  };
}
