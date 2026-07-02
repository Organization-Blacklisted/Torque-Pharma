import { cache } from "react";
import { apiFetch, type ApiResponse } from "./fetcher";
import type { AwardsPageData } from "@/types/awards";

const STORAGE_BASE = process.env.API_URL!.replace(/\/api$/, "/storage");

type RawAwardItem = {
  image: string;
  title: string;
  desc: string;
  tag: string | null;
};

type RawAwardsSection = {
  section_title: string;
  items: RawAwardItem[];
};

type AwardsApiResponse = {
  title: string;
  description: string;
  status: string;
  content: {
    sub_title: string;
    sub_title2: string;
    awards_sections: RawAwardsSection[];
  };
};

export const getAwardsPage = cache(async function getAwardsPage(): Promise<AwardsPageData> {
  const { data } = await apiFetch<ApiResponse<AwardsApiResponse>>(
    "/pages/certifications",
    { revalidate: 3600, tags: ["awards"] }
  );

  return {
    title: data.title,
    eyebrow: data.content.sub_title,
    subtitle: data.content.sub_title2,
    description: data.description.replace(/<[^>]*>/g, "").trim(),
    sections: data.content.awards_sections.map((section) => ({
      section_title: section.section_title,
      variant: section.section_title.toLowerCase().includes("accreditation")
        ? ("accreditation" as const)
        : ("certification" as const),
      items: section.items.map((item) => ({
        image: item.image.startsWith("http") ? item.image : `${STORAGE_BASE}/${item.image}`,
        title: item.title,
        desc: item.desc,
        tag: item.tag,
      })),
    })),
  };
});
