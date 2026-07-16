import { apiFetch, type ApiResponse } from "./fetcher";
import { sanitize } from "@/lib/sanitize";
import { getCountryCategories } from "./country-categories";
import type {
  GlobalPresencePageData,
  GpCertificationItem,
  GpExportCategoryItem,
  GpCredentialItem,
  GpCapabilityGroup,
  GpTorqueModelItem,
} from "@/types/global-presence";

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

// ─── Fetcher ──────────────────────────────────────────────────────────────────

export async function getExportCategories(): Promise<string[]> {
  const { data } = await apiFetch<ApiResponse<RawGlobalPresencePage>>("/pages/global-presence", {
    tags: ["global-presence"],
    revalidate: 3600,
  });
  return data.content.gp_export_categories_section.items.map((item) => item.title);
}

export async function getGlobalPresencePage(): Promise<GlobalPresencePageData> {
  const [{ data }, countryCategories] = await Promise.all([
    apiFetch<ApiResponse<RawGlobalPresencePage>>("/pages/global-presence", {
      tags: ["global-presence"],
      revalidate: 3600,
    }),
    getCountryCategories(),
  ]);

  const c = data.content;

  return {
    top: {
      eyebrow: c.gp_top_section.title,
      heading: c.gp_top_section.sub_title,
      subHeading: c.gp_top_section.sub_title2,
      description: c.gp_top_section.desc,
      cta: {
        label: c.gp_top_section.button_text,
        href: c.gp_top_section.button_link,
      },
    },
    certifications: {
      eyebrow: c.gp_certifications_section.title,
      items: c.gp_certifications_section.items.map<GpCertificationItem>((item) => ({
        image: item.image,
        title: item.title,
      })),
    },
    presence: {
      eyebrow: c.gp_presence_section.title,
      heading: c.gp_presence_section.sub_title,
      description: c.gp_presence_section.desc,
      cta: {
        label: c.gp_presence_section.button_text,
        href: c.gp_presence_section.button_link,
      },
      regions: countryCategories.map((cat) => ({
        title: cat.name,
        slug: cat.slug,
        countries: cat.countries.map((country) => ({
          title: country.name,
          slug: country.slug,
          flagImage: country.flagImage,
        })),
      })),
    },
    exportCategories: {
      eyebrow: c.gp_export_categories_section.title,
      items: c.gp_export_categories_section.items.map<GpExportCategoryItem>((item) => ({
        image: item.image,
        title: item.title,
        href: item.link,
      })),
    },
    credentials: {
      eyebrow: c.gp_export_credentials_section.title,
      title: c.gp_export_credentials_section.sub_title,
      description: c.gp_export_credentials_section.desc,
      items: c.gp_export_credentials_section.items.map<GpCredentialItem>((item) => ({
        image: item.image,
        title: item.title,
        description: item.desc.replace(/\r\n/g, " ").trim(),
      })),
    },
    exportCapability: {
      eyebrow: c.gp_export_capability_section.title,
      heading: c.gp_export_capability_section.sub_title,
      description: c.gp_export_capability_section.desc,
      groups: c.gp_export_capability_section.groups.map<GpCapabilityGroup>((group) => ({
        items: group.items.map((item) => ({
          image: item.image,
          title: item.title,
          subTitle: item.sub_title,
          description: item.desc,
        })),
      })),
    },
    torqueModel: {
      eyebrow: c.gp_torque_model_section.title,
      heading: c.gp_torque_model_section.sub_title,
      description: c.gp_torque_model_section.desc,
      items: c.gp_torque_model_section.items.map<GpTorqueModelItem>((item) => ({
        image: item.image,
        title: item.title,
      })),
    },
    form: {
      eyebrow: c.gp_form_section.title,
      heading: c.gp_form_section.sub_title,
      image: c.gp_form_section.image,
    },
    faq: {
      eyebrow: c.gp_faqs_section.title,
      title: c.gp_faqs_section.sub_title,
      description: c.gp_faqs_section.desc,
      items: c.gp_faqs_section.items.map((item) => ({
        title: item.title,
        content: sanitize(item.desc),
      })),
    },
  };
}
