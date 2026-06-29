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
  const label = `[API] ${endpoint}`;

  if (dev) console.time(label);
  const res = await fetch(url, {
    next: {
      revalidate,
      ...(tags ? { tags } : {}),
    },
  });
  if (dev) console.timeEnd(label);

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText} — ${url}`);
  }

  return res.json() as Promise<T>;
}
