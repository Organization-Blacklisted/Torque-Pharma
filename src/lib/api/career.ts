import { apiFetch, type ApiResponse } from "./fetcher";
import { sanitize } from "@/lib/sanitize";

// ─── Raw API types ────────────────────────────────────────────────────────────

interface RawCareerPage {
  content: {
    career_top_section: {
      title: string;
      sub_title: string;
      desc: string;
      button_text: string;
      button_link: string;
      items: { image: string; title: string }[];
    };
    why_join_section: {
      title: string;
      sub_title: string;
      desc: string;
      items: { image: string; title: string; desc: string }[];
    };
    open_positions_section: {
      title: string;
      sub_title: string;
      desc: string;
      left_items: { image: string; title: string; desc: string }[];
      center_items: { image: string }[];
      right_items: { image: string; title: string; desc: string }[];
    };
    career_faq_section: {
      title: string;
      sub_title: string;
      items: { title: string; desc: string }[];
    };
    career_cta_section: {
      title: string;
      sub_title: string;
      button_text: string;
      button_link: string;
    };
    career_experts_section: {
      title: string;
      sub_title: string;
      items: {
        name: string;
        designation: string;
        about: string;
        poster_image: string;
        video: string | null;
      }[];
    };
    career_form_section: {
      title: string;
      desc: string;
    };
    career_testimonial_section: {
      title: string;
      desc: string;
    };
  };
}

// ─── Transformed types ────────────────────────────────────────────────────────

export interface CareerFaqData {
  heading: string;
  subTitle: string;
  items: { title: string; content: string }[];
}

export interface CareerCtaData {
  eyebrow: string;
  title: string;
  button: { label: string; href: string };
}

export interface CareerTestimonialData {
  quote: string;
  attribution: string;
}

export interface CareerTopItem {
  image: string;
  title: string;
}

export interface CareerTopData {
  eyebrow: string;
  heading: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  items: CareerTopItem[];
}

export interface WhyJoinItem {
  icon: string;
  title: string;
  description: string;
}

export interface WhyJoinData {
  eyebrow: string;
  heading: string;
  description: string;
  items: WhyJoinItem[];
}

export interface CareerFormData {
  title: string;
  disclaimer: string;
}

export interface OpenPositionItem {
  image: string;
  title: string;
  description: string;
}

export interface OpenPositionCenterItem {
  image: string;
}

export interface OpenPositionsData {
  eyebrow: string;
  heading: string;
  description: string;
  leftItems: OpenPositionItem[];
  centerItems: OpenPositionCenterItem[];
  rightItems: OpenPositionItem[];
}

export interface CareerExpertItem {
  name: string;
  designation: string;
  about: string;
  posterImage: string;
  video: string | null;
}

export interface CareerExpertsData {
  eyebrow: string;
  heading: string;
  items: CareerExpertItem[];
}

export interface CareerPageData {
  topSection: CareerTopData;
  whyJoin: WhyJoinData;
  openPositions: OpenPositionsData;
  experts: CareerExpertsData;
  faq: CareerFaqData;
  cta: CareerCtaData;
  testimonial: CareerTestimonialData;
  form: CareerFormData;
}

// ─── Fetcher ──────────────────────────────────────────────────────────────────

export async function getCareerPage(): Promise<CareerPageData> {
  const { data: raw } = await apiFetch<ApiResponse<RawCareerPage>>("/pages/career", {
    tags: ["career"],
    revalidate: 3600,
  });

  const topRaw = raw.content.career_top_section;
  const whyJoinRaw = raw.content.why_join_section;
  const openPositionsRaw = raw.content.open_positions_section;
  const expertsRaw = raw.content.career_experts_section;
  const faqRaw = raw.content.career_faq_section;
  const ctaRaw = raw.content.career_cta_section;
  const formRaw = raw.content.career_form_section;
  const testimonialRaw = raw.content.career_testimonial_section;

  return {
    topSection: {
      eyebrow: topRaw.title,
      heading: topRaw.sub_title,
      description: topRaw.desc,
      buttonText: topRaw.button_text,
      buttonLink: topRaw.button_link,
      items: topRaw.items.map((item) => ({
        image: item.image,
        title: item.title,
      })),
    },
    whyJoin: {
      eyebrow: whyJoinRaw.title,
      heading: whyJoinRaw.sub_title,
      description: whyJoinRaw.desc,
      items: whyJoinRaw.items.map((item) => ({
        icon: item.image,
        title: item.title,
        description: item.desc,
      })),
    },
    openPositions: {
      eyebrow: openPositionsRaw.title,
      heading: openPositionsRaw.sub_title,
      description: openPositionsRaw.desc,
      leftItems: openPositionsRaw.left_items.map((item) => ({
        image: item.image,
        title: item.title,
        description: item.desc,
      })),
      centerItems: openPositionsRaw.center_items.map((item) => ({
        image: item.image,
      })),
      rightItems: openPositionsRaw.right_items.map((item) => ({
        image: item.image,
        title: item.title,
        description: item.desc,
      })),
    },
    experts: {
      eyebrow: expertsRaw.title,
      heading: expertsRaw.sub_title,
      items: expertsRaw.items.map((item) => ({
        name: item.name,
        designation: item.designation,
        about: item.about,
        posterImage: item.poster_image,
        video: item.video,
      })),
    },
    faq: {
      heading: faqRaw.title,
      subTitle: faqRaw.sub_title,
      items: faqRaw.items.map((item) => ({
        title: item.title,
        content: sanitize(item.desc),
      })),
    },
    cta: {
      eyebrow: ctaRaw.title,
      title: ctaRaw.sub_title,
      button: { label: ctaRaw.button_text, href: ctaRaw.button_link },
    },
    testimonial: {
      quote: testimonialRaw.desc,
      attribution: testimonialRaw.title,
    },
    form: {
      title: formRaw.title,
      disclaimer: formRaw.desc,
    },
  };
}
