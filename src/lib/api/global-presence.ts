import { apiFetch, type ApiResponse } from "./fetcher";
import type { AccordionItem } from "@/components/ui/Accordion/Accordion.types";

// ─── Raw API shape ────────────────────────────────────────────────────────────

interface RawGlobalPresencePage {
  content: {
    gp_top_section: {
      title: string;
      sub_title: string;
      sub_title2: string;
      desc: string;
      button_text: string;
      button_link: string;
    };
    gp_certifications_section: {
      title: string;
      items: { image: string; title: string }[];
    };
    gp_presence_section: {
      title: string;
      sub_title: string;
      desc: string;
      button_text: string;
      button_link: string;
      items: {
        title: string;
        countries: { image: string | null; title: string }[];
      }[];
    };
    gp_export_categories_section: {
      title: string;
      sub_title: string | null;
      items: { image: string; title: string; link: string }[];
    };
    gp_export_credentials_section: {
      title: string;
      sub_title: string;
      desc: string;
      items: { image: string; title: string; desc: string }[];
    };
    gp_export_capability_section: {
      title: string;
      sub_title: string;
      desc: string;
      groups: {
        items: {
          image: string | null;
          title: string;
          sub_title: string;
          desc: string;
        }[];
      }[];
    };
    gp_torque_model_section: {
      title: string;
      sub_title: string;
      desc: string;
      items: { image: string; title: string }[];
    };
    gp_form_section: {
      title: string;
      sub_title: string;
      image: string;
    };
    gp_faqs_section: {
      title: string;
      sub_title: string;
      desc: string;
      items: { title: string; desc: string }[];
    };
  };
}

// ─── Transformed types ────────────────────────────────────────────────────────

export interface GpFaqData {
  eyebrow: string;
  title: string;
  description: string;
  items: AccordionItem[];
}

export interface GpCredentialItem {
  image: string;
  title: string;
  description: string;
}

export interface GpExportCredentialsData {
  eyebrow: string;
  title: string;
  description: string;
  items: GpCredentialItem[];
}

export interface GlobalPresencePageData {
  credentials: GpExportCredentialsData;
  faq: GpFaqData;
}

// ─── Fetcher ──────────────────────────────────────────────────────────────────

export async function getGlobalPresencePage(): Promise<GlobalPresencePageData> {
  const { data } = await apiFetch<ApiResponse<RawGlobalPresencePage>>("/pages/global-presence", {
    tags: ["global-presence"],
    revalidate: 3600,
  });

  const credentialsRaw = data.content.gp_export_credentials_section;
  const faqRaw = data.content.gp_faqs_section;

  return {
    credentials: {
      eyebrow: credentialsRaw.title,
      title: credentialsRaw.sub_title,
      description: credentialsRaw.desc,
      items: credentialsRaw.items.map((item) => ({
        image: item.image,
        title: item.title,
        description: item.desc,
      })),
    },
    faq: {
      eyebrow: faqRaw.title,
      title: faqRaw.sub_title,
      description: faqRaw.desc,
      items: faqRaw.items.map((item) => ({
        title: item.title,
        content: item.desc,
      })),
    },
  };
}
