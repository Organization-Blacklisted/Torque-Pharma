import { apiFetch, type ApiResponse } from "./fetcher";

// ─── Raw API types ────────────────────────────────────────────────────────────

interface RawLifeAtTorquePage {
  content: {
    lat_top_section: {
      title: string;
      sub_title: string;
      desc: string;
      short_desc: string;
      button_text: string;
      button_link: string;
      gallery: { image: string }[];
    };
    lat_workplace_section: {
      title: string;
      sub_title: string;
      desc: string;
      items: { image: string; title: string; desc: string }[];
    };
    lat_built_on_section: {
      title: string;
      sub_title: string;
      desc: string;
      items: { image: string; title: string; desc: string }[];
    };
    lat_beyond_job_section: {
      title: string;
      sub_title: string;
      images: { img: { image: string }[] }[];
    };
    lat_testimonial_section: {
      title: string;
      desc: string;
    };
    lat_find_role_section: {
      title: string;
      items: { image: string; title: string; sub_title: string; desc: string }[];
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

export interface LatTopData {
  eyebrow: string;
  title: string;
  description: string;
  shortDescription: string;
  button: { label: string; href: string };
  gallery: string[];
}

export interface LatWorkplaceItem {
  image: string;
  title: string;
  description: string;
}

export interface LatWorkplaceData {
  eyebrow: string;
  title: string;
  description: string;
  items: LatWorkplaceItem[];
}

export interface LatBuiltOnItem {
  image: string;
  title: string;
  description: string;
}

export interface LatBuiltOnData {
  eyebrow: string;
  title: string;
  description: string;
  items: LatBuiltOnItem[];
}

export interface LatBeyondJobData {
  eyebrow: string;
  title: string;
  columns: string[][];
}

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
  top: LatTopData;
  workplace: LatWorkplaceData;
  builtOn: LatBuiltOnData;
  beyondJob: LatBeyondJobData;
  testimonial: LatTestimonialData;
  findRole: LatFindRoleData;
  cta: LatCtaData;
}

// ─── Fetcher ──────────────────────────────────────────────────────────────────

export async function getLifeAtTorquePage(): Promise<LifeAtTorquePageData> {
  const { data: raw } = await apiFetch<ApiResponse<RawLifeAtTorquePage>>("/pages/life-at-torque", {
    tags: ["life-at-torque"],
    revalidate: 3600,
  });

  const topRaw       = raw.content.lat_top_section;
  const workplaceRaw = raw.content.lat_workplace_section;
  const builtOnRaw   = raw.content.lat_built_on_section;
  const beyondRaw    = raw.content.lat_beyond_job_section;
  const testimonialRaw = raw.content.lat_testimonial_section;
  const findRoleRaw  = raw.content.lat_find_role_section;
  const ctaRaw       = raw.content.lat_cta_section;

  return {
    top: {
      eyebrow: topRaw.title,
      title: topRaw.sub_title,
      description: topRaw.desc,
      shortDescription: topRaw.short_desc,
      button: { label: topRaw.button_text, href: topRaw.button_link },
      gallery: topRaw.gallery.map((g) => g.image),
    },
    workplace: {
      eyebrow: workplaceRaw.title,
      title: workplaceRaw.sub_title,
      description: workplaceRaw.desc,
      items: workplaceRaw.items.map((item) => ({
        image: item.image,
        title: item.title,
        description: item.desc,
      })),
    },
    builtOn: {
      eyebrow: builtOnRaw.title,
      title: builtOnRaw.sub_title,
      description: builtOnRaw.desc,
      items: builtOnRaw.items.map((item) => ({
        image: item.image,
        title: item.title,
        description: item.desc,
      })),
    },
    beyondJob: {
      eyebrow: beyondRaw.title,
      title: beyondRaw.sub_title,
      columns: beyondRaw.images.map((col) => col.img.map((i) => i.image)),
    },
    testimonial: {
      quote: testimonialRaw.desc,
      attribution: testimonialRaw.title,
    },
    findRole: {
      title: findRoleRaw.title,
      items: findRoleRaw.items.map((item) => ({
        image: item.image,
        title: item.title,
        subtitle: item.sub_title,
        description: item.desc,
      })),
    },
    cta: {
      eyebrow: ctaRaw.title,
      title: ctaRaw.sub_title,
      button: { label: ctaRaw.button_text, href: ctaRaw.button_link },
    },
  };
}
