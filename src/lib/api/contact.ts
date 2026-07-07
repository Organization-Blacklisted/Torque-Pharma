import { apiFetch, type ApiResponse } from "./fetcher";

// ─── Raw API shape ────────────────────────────────────────────────────────────

type ContactApiResponse = {
  description: string;
  content: {
    sub_title: string;
    description: string;
    contact_info: {
      image: string;
      text: string;
      description: string;
    }[];
    enquiry_support_section: {
      title: string;
      sub_title: string;
      description: string;
      description_2: string | null;
    };
  };
};

// ─── Transformed shape ────────────────────────────────────────────────────────

export type ContactPageData = {
  info: {
    eyebrow: string;
    heading: string;
    description: string;
    items: {
      image: string;
      text: string;
      description: string;
    }[];
  };
  enquiry: {
    eyebrow: string;
    heading: string;
    description: string;
  };
};

// ─── Fetcher ──────────────────────────────────────────────────────────────────

export async function getContactPage(): Promise<ContactPageData> {
  const { data } = await apiFetch<ApiResponse<ContactApiResponse>>(
    "/pages/contact-us",
    { revalidate: 3600, tags: ["contact-us"] },
  );

  const c = data.content;

  // Strip <p> tags from top-level description to get plain eyebrow text
  const eyebrow = data.description.replace(/<[^>]+>/g, "").trim();

  return {
    info: {
      eyebrow,
      heading: c.sub_title,
      description: c.description,
      items: c.contact_info.map((item) => ({
        image: item.image,
        text: item.text,
        description: item.description,
      })),
    },

    enquiry: {
      eyebrow: c.enquiry_support_section.title,
      heading: c.enquiry_support_section.sub_title,
      description: c.enquiry_support_section.description,
    },
  };
}
