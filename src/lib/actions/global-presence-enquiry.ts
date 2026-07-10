"use server";

export interface GlobalPresenceEnquiryPayload {
  page_name: string;
  page_url: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_country_code: string;
  phone_number: string;
  company: string;
  area_of_interest: string;
  product_category: string;
  message: string;
}

export async function submitGlobalPresenceEnquiry(
  payload: GlobalPresenceEnquiryPayload,
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${process.env.API_URL}/form/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enquiry_type: "Global Presence", ...payload }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { success: false, error: body?.message ?? "Something went wrong. Please try again." };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Network error. Please check your connection and try again." };
  }
}
