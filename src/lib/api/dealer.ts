import { apiFetch, type ApiResponse } from "./fetcher";
import { toFaq } from "./faq";
import type { RawFaqSection, FaqData } from "@/types/faq";
import type { ContentMediaData } from "@/types/content-media";

// ─── Raw API shape ────────────────────────────────────────────────────────────

type DealerApiResponse = {
  content: {
    banner_section: {
      title: string;
      sub_title: string;
      desc: string;
      image: string;
      button_text: string;
      button_link: string;
    };
    benefits_section: {
      title: string;
      sub_title: string;
      items: { image: string; title: string; desc: string }[];
    };
    eligibility_section: {
      title: string;
      sub_title: string;
      desc: string;
      items: {
        title: string;
        content: { text: string }[];
      }[];
    };
    network_section: {
      title: string;
      sub_title: string;
      desc: string;
      image: string;
    };
    cta_section: {
      title: string;
      sub_title: string;
      button_text: string;
      button_link: string;
    };
    faqs_section: RawFaqSection;
  };
};

// ─── Transformed shape ────────────────────────────────────────────────────────

export type DealerPageData = {
  banner: ContentMediaData;
  benefits: {
    eyebrow: string;
    title: string;
    items: { icon: string; title: string; description: string }[];
  };
  eligibility: {
    eyebrow: string;
    heading: string;
    description: string;
    items: { title: string; content: { text: string }[] }[];
  };
  network: {
    eyebrow: string;
    heading: string;
    description: string;
    image: string;
  };
  cta: {
    eyebrow: string;
    title: string;
    button: { label: string; href: string };
  };
  faq: FaqData;
};

// ─── Fetcher ──────────────────────────────────────────────────────────────────

export async function getDealerPage(): Promise<DealerPageData> {
  const { data } = await apiFetch<ApiResponse<DealerApiResponse>>(
    "/pages/become-a-dealer",
    { revalidate: 3600, tags: ["dealer"] },
  );

  const b = data.content.banner_section;
  const ben = data.content.benefits_section;
  const elig = data.content.eligibility_section;
  const net = data.content.network_section;
  const cta = data.content.cta_section;
  const faqs = data.content.faqs_section;
  
  return {
    banner: {
      eyebrow: b.title,
      heading: b.sub_title,
      description: b.desc,
      layout: "centered",
      media: {
        type: "image",
        src: b.image,
        alt: b.sub_title,
      },
      actions: [
        {
          label: b.button_text,
          href: b.button_link,
          variant: "primary",
        },
      ],
    },

    benefits: {
      eyebrow: ben.title,
      title: ben.sub_title,
      items: ben.items.map((item) => ({
        icon: item.image,
        title: item.title,
        description: item.desc,
      })),
    },

    eligibility: {
      eyebrow: elig.title,
      heading: elig.sub_title,
      description: elig.desc,
      items: elig.items,
    },

    network: {
      eyebrow: net.title,
      heading: net.sub_title,
      description: net.desc,
      image: net.image,
    },

    cta: {
      eyebrow: cta.title,
      title: cta.sub_title,
      button: { label: cta.button_text, href: cta.button_link },
    },

    faq: toFaq(faqs),
  };
}
