"use server";

export interface ExportEnquiryPayload {
  page_name: string;
  page_url: string;
  full_name: string;
  company_name: string;
  email: string;
  phone_country_code: string;
  phone_number: string;
  state: string;
  area_of_interest: string;
  product_category: string;
  expected_order_volume: string;
  message: string;
}

export async function submitExportEnquiry(
  payload: ExportEnquiryPayload,
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${process.env.API_URL}/form/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enquiry_type: "Export", ...payload }),
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
