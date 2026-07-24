// Shared helpers for transforming raw API field formats into typed props.

// "2.83 <span>Billion</span>" → { value: "2.83", suffix: "Billion" }; "13+" → { value: "13+" }
export function parseStatValue(raw: string): { value: string; suffix?: string } {
  const match = raw.match(/^(.*?)\s*<span>(.*?)<\/span>\s*$/);
  if (!match) return { value: raw.trim() };
  return { value: match[1].trim(), suffix: match[2].trim() };
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// CMS long-form sections are sometimes plain text, sometimes HTML, sometimes mixed
// (plain text intro followed by <ul> or <h3>). Strategy:
// - If content already starts with a block element, it's structured HTML — return as-is.
// - Otherwise split on self-contained block elements, wrap plain text segments in <p>.
export function normalizeDescription(text: string): string {
  if (/^\s*<(?:p|h[1-6]|ul|ol|div|blockquote)\b/i.test(text.trim())) return text;

  const blockRe = /(<(?:h[1-6]|ul|ol|div|blockquote|table|pre)\b[\s\S]*?<\/(?:h[1-6]|ul|ol|div|blockquote|table|pre)>)/gi;

  return text
    .split(blockRe)
    .map((segment) => {
      if (/^\s*<(?:h[1-6]|ul|ol|div|blockquote|table|pre)\b/i.test(segment)) {
        return segment;
      }
      return segment
        .split(/\r?\n\r?\n/)
        .map((para) => para.trim())
        .filter(Boolean)
        .map((para) => `<p>${para.replace(/\r?\n/g, "<br>")}</p>`)
        .join("");
    })
    .join("");
}
