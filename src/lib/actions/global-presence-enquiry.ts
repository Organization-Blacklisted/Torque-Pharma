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
    // Laravel's shared /form/submit endpoint expects a single full_name field,
    // not first_name/last_name — combined here so the form can keep two inputs.
    const { first_name, last_name, ...rest } = payload;
    const res = await fetch(`${process.env.API_URL}/form/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      // "Global Presence" isn't a value Laravel's enquiry_type validation
      // accepts (confirmed live) — omit it rather than fail the submission;
      // ask Laravel what the correct value should be, if any.
      body: JSON.stringify({ full_name: `${first_name} ${last_name}`.trim(), ...rest }),
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
