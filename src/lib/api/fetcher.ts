const API_BASE = process.env.API_URL;

if (!API_BASE) {
  throw new Error("API_URL environment variable is not set.");
}

// Shared response envelope used by all API endpoints
export type ApiResponse<T> = {
  success: boolean;
  data: T;
};

type FetchOptions = {
  revalidate?: number | false;
  tags?: string[];
};

export async function apiFetch<T>(
  endpoint: string,
  { revalidate = 3600, tags }: FetchOptions = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const dev = process.env.NODE_ENV === "development";
  const t0 = dev ? performance.now() : 0;
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
    next: {
      revalidate,
      ...(tags ? { tags } : {}),
    },
  });
  if (dev) console.log(`[API] ${endpoint} — ${(performance.now() - t0).toFixed(0)}ms`);

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText} — ${url}`);
  }

  return res.json() as Promise<T>;
}
