import { apiFetch, type ApiResponse } from "./fetcher";
import { parseStatValue } from "./utils";
import { sanitizeRichText } from "@/lib/sanitize";
import type { HeroVideoData } from "@/types/hero";
import type { HomeBlogsPreviewData } from "@/types/blog";
import type { HomeImpactData } from "@/types/home-impact";
import type { LifeAtTorqueData } from "@/types/life-at-torque";
import type { GlobalPresenceData } from "@/types/global-presence";
import type { ContractManufacturingData } from "@/types/contract-manufacturing";
import type { HomeOverviewData } from "@/types/home-overview";
import type { StatsMediaData } from "@/types/homepage";
import type { TorqueLineupData } from "@/types/torque-lineup";
import type { TherapeuticAreasData } from "@/types/therapeutic-areas";

// ─── Raw API shape ─────────────────────────────────────────────────────────────
// Mirrors the /pages/home response exactly. Extend as more sections are wired up.

type HomeApiResponse = {
  content: {
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
      sub_title: string;
      items: {
        title: string;
        image: string;
        sub_title: string;
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
      title: string | null;
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
    therapeutic_areas_section: {
      title: string;
      sub_title: string;
      description: string;
      view_text: string;
      view_link: string;
      categories: { id: number; title: string; image: string; slug: string }[];
    };
    blogs_section: HomeBlogsPreviewData;
    zero_defect_section: {
      title: string;
      sub_title: string;
      description: string;
      view_text: string;
      view_link: string;
      video: string | null;
      video_title: string;
      video_desc: string;
      items: {
        title: string;
        sub_title: string;
        description: string;
        inner_items: { title: string; sub_title: string; description: string }[];
      }[];
    };
    torque_lineup_section: {
      title: string;
      sub_title: string;
      description: string;
      items: {
        image: string;
        hover_image: string;
        title: string;
        tag: string;
        hover_tag: string;
        button_text: string;
        button_link: string;
      }[];
    };
  };
};

// API doesn't supply brand colors — keyed by hover_tag, the brand name the API sends in caps
const BRAND_PILL_COLORS: Record<string, string> = {
  TOREX: "#446615",
  "NO SCARS": "#9D1A41",
  MEDISALIC: "#A13790",
  KETOMAC: "#446615",
};

// API sends bare domains like "www.torex.co.in" with no protocol; "#" is a real unset placeholder, leave it
function normalizeExternalUrl(url: string): string {
  if (url === "#" || /^https?:\/\//.test(url)) return url;
  return `https://${url}`;
}

// ─── Transformed shape ─────────────────────────────────────────────────────────
// What page.tsx receives — component-ready, no raw API types leak out.

export type HomePageData = {
  hero: HeroVideoData;
  overview: HomeOverviewData;
  impact: HomeImpactData;
  globalPresence: GlobalPresenceData;
  lifeAtTorque: LifeAtTorqueData;
  contractManufacturing: ContractManufacturingData;
  therapeuticAreas: TherapeuticAreasData;
  blogsPreview: HomeBlogsPreviewData;
  statsMedia: StatsMediaData;
  torqueLineup: TorqueLineupData;
};

// ─── Fetcher ───────────────────────────────────────────────────────────────────

export async function getHomePage(): Promise<HomePageData> {
  const { data } = await apiFetch<ApiResponse<HomeApiResponse>>("/pages/home", {
    revalidate: 3600,
    tags: ["homepage"],
  });

  const c = data.content;

  // Parse "<span>BETTER </span> TOGETHER, HEALTH, CARE, HEALTHCARE, TREATMENT, LIVING"
  const spanMatch = c.video_section.title.match(/<span>(.*?)<\/span>/);
  const prefix = spanMatch?.[1].trim() ?? "";
  const afterSpan = c.video_section.title.replace(/<span>.*?<\/span>\s*/, "");
  const words = afterSpan.split(",").map((w) => w.trim()).filter(Boolean);

  // Parse "Committed to a <span>Better World </span>" → heading + headingBold
  const impactSpanMatch = c.our_impact_section.sub_title.match(/<span>(.*?)<\/span>/);
  const headingBold = impactSpanMatch?.[1].trim() ?? "";
  const heading = c.our_impact_section.sub_title.replace(/<span>.*?<\/span>/, "").trim();

  return {
    overview: {
      eyebrow: c.overview_section.title ?? "",
      image: c.overview_section.image,
      description: c.overview_section.description,
      cta: {
        label: c.overview_section.button_text,
        href: c.overview_section.button_link,
      },
    },
    hero: {
      eyebrow: { prefix, words },
      heading: c.video_section.sub_title,
      cta: {
        label: c.video_section.button_text,
        href: c.video_section.button_link,
      },
      video: {
        sources: [{
          src: c.video_section.video,
          type: "video/mp4",
        }],
        poster: c.video_section.image,
      },
    },
    impact: {
      eyebrow: c.our_impact_section.title,
      heading,
      headingBold,
      tabs: c.our_impact_section.items.map((item) => ({
        slug: item.title.toLowerCase().replace(/\s+/g, "-"),
        label: item.title,
        image: { src: item.image, alt: item.sub_title },
        title: item.sub_title,
        description: item.description,
      })),
    },
    globalPresence: {
      eyebrow: c.global_presence_section.title,
      heading: c.global_presence_section.sub_title,
      description: sanitizeRichText(c.global_presence_section.description),
      items: c.global_presence_section.items,
    },
    lifeAtTorque: {
      eyebrow: c.life_at_torque_section.title,
      heading: c.life_at_torque_section.sub_title,
      description: c.life_at_torque_section.description,
      stat: {
        value: c.life_at_torque_section.dedicated_professionals_title,
        label: c.life_at_torque_section.dedicated_professionals_text,
      },
      buttons: Array.isArray(c.life_at_torque_section.buttons)
        ? c.life_at_torque_section.buttons.map((btn) => ({ label: btn.title, href: btn.link }))
        : [],
      images: Array.isArray(c.life_at_torque_section.images)
        ? c.life_at_torque_section.images.map((group) =>
            Object.values(group).flat().map((img) => img.image)
          )
        : [],
    },
    contractManufacturing: {
      eyebrow: c.contract_manufacturing_section.title,
      heading: c.contract_manufacturing_section.sub_title,
      description: c.contract_manufacturing_section.description,
      items: c.contract_manufacturing_section.items.map((item) => ({
        icon: item.image,
        title: item.title,
        description: item.description,
      })),
      cta: {
        label: c.contract_manufacturing_section.view_text,
        href: c.contract_manufacturing_section.view_link,
      },
    },
    therapeuticAreas: {
      eyebrow: c.therapeutic_areas_section.title,
      heading: c.therapeutic_areas_section.sub_title,
      description: c.therapeutic_areas_section.description,
      items: c.therapeutic_areas_section.categories.map((cat) => ({
        title: cat.title,
        image: cat.image,
        href: `/category/domestic/${cat.slug}`,
      })),
      cta: {
        label: c.therapeutic_areas_section.view_text,
        href: c.therapeutic_areas_section.view_link,
      },
    },
    blogsPreview: c.blogs_section,
    statsMedia: {
      eyebrow: c.zero_defect_section.title,
      title: c.zero_defect_section.sub_title,
      description: c.zero_defect_section.description,
      // Each item is an independent card slot — its inner_items are that slot's own rotation, not one shared list
      stats: c.zero_defect_section.items.map((item) =>
        item.inner_items.map((inner) => {
          const { value, suffix } = parseStatValue(inner.sub_title);
          return {
            label: inner.title,
            value,
            suffix,
            description: inner.description.replace(/\r\n/g, " ").trim(),
            theme: "light" as const,
          };
        })
      ),
      media: {
        sources: c.zero_defect_section.video
          ? [{ src: c.zero_defect_section.video, type: "video/mp4" as const }]
          : [{ src: "/videos/Higher-Standards.mp4", type: "video/mp4" as const }],
      },
      card: {
        title: c.zero_defect_section.video_title,
        description: c.zero_defect_section.video_desc,
      },
      // No footer CTA on this section by design — API supplies view_text/view_link but it's intentionally unused here
    },
    torqueLineup: {
      eyebrow: c.torque_lineup_section.title,
      heading: c.torque_lineup_section.sub_title,
      description: c.torque_lineup_section.description,
      items: c.torque_lineup_section.items.map((item) => ({
        category: item.tag,
        pillColor: BRAND_PILL_COLORS[item.hover_tag] ?? "#1B2978",
        logo: item.image,
        productImage: item.hover_image,
        description: item.title,
        brandName: item.hover_tag,
        href: normalizeExternalUrl(item.button_link),
      })),
    },
  };
}
