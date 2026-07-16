"use server";

export interface CountryEnquiryPayload {
  page_name: string;
  page_url: string;
  first_name: string;
  last_name: string;
  phone_country_code: string;
  phone_number: string;
  email: string;
  company_name: string;
  therapeutic_area: string;
  message: string;
}

export async function submitCountryEnquiry(
  payload: CountryEnquiryPayload,
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${process.env.API_URL}/form/country-enquiry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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
