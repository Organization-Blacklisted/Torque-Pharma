"use server";

export interface CareerApplicationPayload {
  page_name: string;
  page_url: string;
  full_name: string;
  email: string;
  phone_country_code: string;
  phone_number: string;
  current_location: string;
  applying_for: string;
  experience: string;
  linkedin_url: string;
  message: string;
  resume_filename?: string;
  resume_base64?: string;
}

export async function submitCareerApplication(
  payload: CareerApplicationPayload,
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${process.env.API_URL}/form/career-form`, {
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
