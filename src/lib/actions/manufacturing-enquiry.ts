"use server";

export interface ManufacturingEnquiryPayload {
  page_name: string;
  page_url: string;
  full_name: string;
  company_name: string;
  email: string;
  phone_country_code: string;
  phone_number: string;
  state: string;
  product_type: string;
  quantity: string;
  message: string;
}

export async function submitManufacturingEnquiry(
  payload: ManufacturingEnquiryPayload,
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${process.env.API_URL}/form/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enquiry_type: "manufacturing", ...payload }),
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
