"use server";

export interface ThirdPartyManufacturingPayload {
  page_name: string;
  page_url: string;
  full_name: string;
  company_name: string;
  email: string;
  phone_country_code: string;
  phone_number: string;
  manufacturing_requirement: string;
  product_details: string;
  message: string;
}

export async function submitThirdPartyManufacturingEnquiry(
  payload: ThirdPartyManufacturingPayload,
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${process.env.API_URL}/form/third-party-manufacturing`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
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
