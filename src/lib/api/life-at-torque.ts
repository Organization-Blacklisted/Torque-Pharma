import { apiFetch, type ApiResponse } from "./fetcher";

// ─── Raw API types ────────────────────────────────────────────────────────────

interface RawLifeAtTorquePage {
  content: {
    lat_find_role_section: {
      title: string;
      items: { image: string; title: string; sub_title: string; desc: string }[];
    };
    lat_testimonial_section: {
      title: string;
      desc: string;
    };
    lat_cta_section: {
      title: string;
      sub_title: string;
      button_text: string;
      button_link: string;
    };
  };
}

// ─── Transformed types ────────────────────────────────────────────────────────

export interface LatFindRoleData {
  title: string;
  items: { image: string; title: string; subtitle: string; description: string }[];
}

export interface LatTestimonialData {
  quote: string;
  attribution: string;
}

export interface LatCtaData {
  eyebrow: string;
  title: string;
  button: { label: string; href: string };
}

export interface LifeAtTorquePageData {
  findRole: LatFindRoleData;
  testimonial: LatTestimonialData;
  cta: LatCtaData;
}

// ─── Fetcher ──────────────────────────────────────────────────────────────────

export async function getLifeAtTorquePage(): Promise<LifeAtTorquePageData> {
  const { data: raw } = await apiFetch<ApiResponse<RawLifeAtTorquePage>>("/pages/life-at-torque", {
    tags: ["life-at-torque"],
    revalidate: 3600,
  });

  const findRoleRaw = raw.content.lat_find_role_section;
  const testimonialRaw = raw.content.lat_testimonial_section;
  const ctaRaw = raw.content.lat_cta_section;

  return {
    findRole: {
      title: findRoleRaw.title,
      items: findRoleRaw.items.map((item) => ({
        image: item.image,
        title: item.title,
        subtitle: item.sub_title,
        description: item.desc,
      })),
    },
    testimonial: {
      quote: testimonialRaw.desc,
      attribution: testimonialRaw.title,
    },
    cta: {
      eyebrow: ctaRaw.title,
      title: ctaRaw.sub_title,
      button: { label: ctaRaw.button_text, href: ctaRaw.button_link },
    },
  };
}
