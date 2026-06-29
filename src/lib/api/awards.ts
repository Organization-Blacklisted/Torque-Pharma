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
    awards_sections: RawAwardsSection[];
  };
};

export async function getAwardsPage(): Promise<AwardsPageData> {
  const { data } = await apiFetch<ApiResponse<AwardsApiResponse>>(
    "/pages/awards-accreditations",
    { revalidate: 3600, tags: ["awards"] }
  );

  // Extract last <p> from the HTML description for the section subheading
  const matches = data.description.match(/<p>([\s\S]*?)<\/p>/g);
  const description = matches
    ? matches[matches.length - 1].replace(/<\/?p>/g, "").trim()
    : "";

  return {
    title: data.title,
    description,
    sections: data.content.awards_sections.map((section) => ({
      section_title: section.section_title,
      items: section.items.map((item) => ({
        image: `${STORAGE_BASE}/${item.image}`,
        title: item.title,
        desc: item.desc,
        tag: item.tag,
      })),
    })),
  };
}
