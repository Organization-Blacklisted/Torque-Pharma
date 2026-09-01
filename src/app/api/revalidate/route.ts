import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// Every attempt is logged (visible via `pm2 logs frontend` on the server) so
// a disputed "I called revalidate" claim can be checked against a real
// timestamp instead of relying on whoever calls it to report honestly —
// including failed attempts (wrong secret, missing tag), since those look
// identical to "never called it" from the caller's side but not from ours.
function log(outcome: "success" | "invalid-secret" | "missing-tags", details: Record<string, unknown>) {
  console.log(`[revalidate] ${new Date().toISOString()} outcome=${outcome}`, details);
}

// Laravel calls this whenever published content changes, so Vercel's ISR
// cache doesn't sit on stale data for up to an hour (see fetcher.ts revalidate window).
export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidate-secret");

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    // Masked, not the real value — enough to tell "wrong secret" from
    // "no header sent at all" without logging the actual secret.
    log("invalid-secret", { secretProvided: secret ? `${secret.slice(0, 3)}...(${secret.length} chars)` : null });
    return NextResponse.json({ success: false, message: "Invalid secret" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const tags: string[] = Array.isArray(body?.tags)
    ? body.tags
    : typeof body?.tag === "string"
      ? [body.tag]
      : [];

  if (tags.length === 0) {
    log("missing-tags", { body });
    return NextResponse.json(
      { success: false, message: "Provide 'tag' or 'tags' in the request body" },
      { status: 400 }
    );
  }

  // { expire: 0 } forces immediate expiration — this route exists so a webhook
  // can demand fresh data right now, not stale-while-revalidate ("max") semantics.
  tags.forEach((tag) => revalidateTag(tag, { expire: 0 }));

  log("success", { tags });
  return NextResponse.json({ success: true, revalidated: tags, now: Date.now() });
}
