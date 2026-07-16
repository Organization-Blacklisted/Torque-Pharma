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

const MAX_ATTEMPTS = 4;      // 1 initial + 3 retries
const TIMEOUT_MS = 15_000;   // abort a hung request so it can't stall a build
const RETRY_BASE_MS = 500;   // exponential backoff base

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Exponential backoff with jitter — spaces out retries (and de-synchronizes
// concurrent build workers) so a briefly overloaded backend can recover.
const backoff = (attempt: number) =>
  RETRY_BASE_MS * 2 ** (attempt - 1) + Math.floor(Math.random() * 300);

export async function apiFetch<T>(
  endpoint: string,
  { revalidate = 3600, tags }: FetchOptions = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const dev = process.env.NODE_ENV === "development";
  const t0 = dev ? performance.now() : 0;

  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    let res: Response;
    try {
      res = await fetch(url, {
        headers: {
          Accept: "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
        next: {
          revalidate,
          ...(tags ? { tags } : {}),
        },
        signal: controller.signal,
      });
    } catch (err) {
      // Network error or timeout/abort — retry unless this was the last attempt.
      clearTimeout(timeout);
      lastError = err;
      if (attempt < MAX_ATTEMPTS) {
        await sleep(backoff(attempt));
        continue;
      }
      throw err instanceof Error ? err : new Error(`API request failed — ${url}`);
    }
    clearTimeout(timeout);

    // Retry transient server errors (5xx) — the endpoint may be briefly overloaded.
    // 4xx (e.g. 404) is not transient, so it falls through and throws immediately.
    if (res.status >= 500 && attempt < MAX_ATTEMPTS) {
      lastError = new Error(`API error ${res.status}: ${res.statusText} — ${url}`);
      await sleep(backoff(attempt));
      continue;
    }

    if (!res.ok) {
      throw new Error(`API error ${res.status}: ${res.statusText} — ${url}`);
    }

    if (dev) {
      console.log(
        `[API] ${endpoint} — ${(performance.now() - t0).toFixed(0)}ms${attempt > 1 ? ` (attempt ${attempt})` : ""}`
      );
    }

    return res.json() as Promise<T>;
  }

  throw lastError instanceof Error ? lastError : new Error(`API request failed — ${url}`);
}
