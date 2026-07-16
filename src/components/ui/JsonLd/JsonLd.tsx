// Renders SEO structured data (JSON-LD) into a <script type="application/ld+json">.
//
// Built to be "wired now, populated later": the API `seo.schema` field is
// currently null everywhere, so this safely renders NOTHING until the backend
// starts filling it. The moment `schema` holds valid JSON-LD, it appears in the
// page head/body with no further frontend changes.
//
// Server component (no "use client") — the <script> is emitted in the SSR HTML,
// which is exactly what crawlers read.

type JsonLdProps = {
  // Accepts a JSON string (the API contract) or an already-parsed object/array.
  data?: unknown;
};

export default function JsonLd({ data }: JsonLdProps) {
  if (data == null) return null;

  let value: unknown = data;

  if (typeof data === "string") {
    const trimmed = data.trim();
    if (!trimmed) return null;
    try {
      value = JSON.parse(trimmed);
    } catch {
      // Not valid JSON-LD — render nothing rather than inject raw/broken markup.
      return null;
    }
  }

  if (typeof value !== "object" || value === null) return null;

  // Escape "<" so CMS-authored content can't break out of the <script> tag
  // (e.g. a stray "</script>"). Standard safe-JSON-LD injection.
  const json = JSON.stringify(value).replace(/</g, "\\u003c");

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
