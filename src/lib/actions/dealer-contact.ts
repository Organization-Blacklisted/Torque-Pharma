"use server";

export interface DealerContactPayload {
  page_name: string;
  page_url: string;
  full_name: string;
  phone_country_code: string;
  phone_number: string;
  business_name: string;
  business_email: string;
  gst_number: string;
  state: string;
  city_district: string;
  drug_lic_number: string;
  monthly_volume: string;
  message: string;
}

export async function submitDealerContactForm(
  payload: DealerContactPayload
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${process.env.API_URL}/form/become-a-dealer`, {
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
