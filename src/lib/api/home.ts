import { apiFetch, type ApiResponse } from "./fetcher";
import type { HeroVideoData } from "@/types/hero";
import type { HomeBlogsPreviewData } from "@/types/blog";
import type { HomeImpactData } from "@/types/home-impact";
import type { LifeAtTorqueData } from "@/types/life-at-torque";
import type { GlobalPresenceData } from "@/types/global-presence";
import type { ContractManufacturingData } from "@/types/contract-manufacturing";
import type { HomeOverviewData } from "@/types/home-overview";

// ─── Raw API shape ─────────────────────────────────────────────────────────────
// Mirrors the /pages/home response exactly. Extend as more sections are wired up.

type HomeApiResponse = {
  video_section: {
    image: string;
    video: string;
    title: string;
    sub_title: string;
    button_text: string;
    button_link: string;
  };
  our_impact_section: {
    title: string;
    sub_title: string;   // "Committed to a <span>Better World </span>"
    items: {
      title: string;     // tab label
      image: string;
      sub_title: string; // tab content heading
      description: string;
    }[];
  };
  global_presence_section: {
    title: string;
    sub_title: string;
    description: string;
    items: { image: string; title: string }[];
  };
  life_at_torque_section: {
    title: string;
    sub_title: string;
    description: string;
    dedicated_professionals_title: string;
    dedicated_professionals_text: string;
    buttons: { title: string; link: string }[];
    images: Record<string, { image: string }[]>[];
  };
  overview_section: {
    image: string;
    title: string;
    description: string;
    button_text: string;
    button_link: string;
  };
  contract_manufacturing_section: {
    title: string;
    sub_title: string;
    description: string;
    view_text: string;
    view_link: string;
    items: { image: string; title: string; description: string }[];
  };
  blogs_section: HomeBlogsPreviewData;
};

// ─── Transformed shape ─────────────────────────────────────────────────────────
// What page.tsx receives — component-ready, no raw API types leak out.

export type HomePageData = {
  hero: HeroVideoData;
  overview: HomeOverviewData;
  impact: HomeImpactData;
  globalPresence: GlobalPresenceData;
  lifeAtTorque: LifeAtTorqueData;
  contractManufacturing: ContractManufacturingData;
  blogsPreview: HomeBlogsPreviewData;
};

// ─── Fetcher ───────────────────────────────────────────────────────────────────

export async function getHomePage(): Promise<HomePageData> {
  const { data } = await apiFetch<ApiResponse<HomeApiResponse>>("/pages/home", {
    revalidate: 3600,
    tags: ["homepage"],
  });

  // Parse "<span>BETTER </span> TOGETHER, HEALTH, CARE, HEALTHCARE, TREATMENT, LIVING"
  const spanMatch = data.video_section.title.match(/<span>(.*?)<\/span>/);
  const prefix = spanMatch?.[1].trim() ?? "";
  const afterSpan = data.video_section.title.replace(/<span>.*?<\/span>\s*/, "");
  const words = afterSpan.split(",").map((w) => w.trim()).filter(Boolean);

  // Parse "Committed to a <span>Better World </span>" → heading + headingBold
  const impactSpanMatch = data.our_impact_section.sub_title.match(/<span>(.*?)<\/span>/);
  const headingBold = impactSpanMatch?.[1].trim() ?? "";
  const heading = data.our_impact_section.sub_title.replace(/<span>.*?<\/span>/, "").trim();

  return {
    overview: {
      eyebrow: data.overview_section.title,
      image: data.overview_section.image,
      description: data.overview_section.description,
      cta: {
        label: data.overview_section.button_text,
        href: data.overview_section.button_link,
      },
    },
    hero: {
      eyebrow: { prefix, words },
      heading: data.video_section.sub_title,
      cta: {
        label: data.video_section.button_text,
        href: data.video_section.button_link,
      },
      video: {
        sources: [{
          src: process.env.NODE_ENV === "development"
            ? "/videos/home/hero.mp4"
            : data.video_section.video,
          type: "video/mp4",
        }],
        poster: data.video_section.image,
      },
    },
    impact: {
      eyebrow: data.our_impact_section.title,
      heading,
      headingBold,
      tabs: data.our_impact_section.items.map((item) => ({
        slug: item.title.toLowerCase().replace(/\s+/g, "-"),
        label: item.title,
        image: { src: item.image, alt: item.sub_title },
        title: item.sub_title,
        description: item.description,
      })),
    },
    globalPresence: {
      eyebrow: data.global_presence_section.title,
      heading: data.global_presence_section.sub_title,
      description: data.global_presence_section.description,
      items: data.global_presence_section.items,
    },
    lifeAtTorque: {
      eyebrow: data.life_at_torque_section.title,
      heading: data.life_at_torque_section.sub_title,
      description: data.life_at_torque_section.description,
      stat: {
        value: data.life_at_torque_section.dedicated_professionals_title,
        label: data.life_at_torque_section.dedicated_professionals_text,
      },
      buttons: Array.isArray(data.life_at_torque_section.buttons)
        ? data.life_at_torque_section.buttons.map((btn) => ({ label: btn.title, href: btn.link }))
        : [],
      images: Array.isArray(data.life_at_torque_section.images)
        ? data.life_at_torque_section.images.map((group) =>
            Object.values(group).flat().map((img) => img.image)
          )
        : [],
    },
    contractManufacturing: {
      eyebrow: data.contract_manufacturing_section.title,
      heading: data.contract_manufacturing_section.sub_title,
      description: data.contract_manufacturing_section.description,
      items: data.contract_manufacturing_section.items.map((item) => ({
        icon: item.image,
        title: item.title,
        description: item.description,
      })),
      cta: {
        label: data.contract_manufacturing_section.view_text,
        href: data.contract_manufacturing_section.view_link,
      },
    },
    blogsPreview: data.blogs_section,
  };
}
