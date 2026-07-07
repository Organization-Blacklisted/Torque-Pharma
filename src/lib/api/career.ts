import { apiFetch, type ApiResponse } from "./fetcher";

// ─── Raw API types ────────────────────────────────────────────────────────────

interface RawCareerPage {
  content: {
    faq_section: {
      title: string;
      sub_title: string;
      items: { title: string; desc: string }[];
    };
    cta_section: {
      title: string;
      sub_title: string;
      button_text: string;
      button_link: string;
    };
    testimonial_section: {
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

export interface CareerPageData {
  faq: CareerFaqData;
  cta: CareerCtaData;
  testimonial: CareerTestimonialData;
}

// ─── Fetcher ──────────────────────────────────────────────────────────────────

export async function getCareerPage(): Promise<CareerPageData> {
  const { data: raw } = await apiFetch<ApiResponse<RawCareerPage>>("/pages/career", {
    tags: ["career"],
    revalidate: 3600,
  });

  const faqRaw = raw.content.faq_section;
  const ctaRaw = raw.content.cta_section;
  const testimonialRaw = raw.content.testimonial_section;

  return {
    faq: {
      heading: faqRaw.title,
      subTitle: faqRaw.sub_title,
      items: faqRaw.items.map((item) => ({
        title: item.title,
        content: item.desc,
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
  };
}
