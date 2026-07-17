import { sanitize } from "@/lib/sanitize";
import type { RawFaqSection, FaqData } from "@/types/faq";

// Single transform for every FAQ block across the API layer.
// Sanitization is enforced HERE because Accordion injects `content` as raw
// HTML and trusts its caller — a fetcher can no longer forget to sanitize.
// Plain-text answers get a <p> wrapper (pre-formatted HTML passes through
// untouched) so the Accordion's [&>p+p] paragraph spacing keeps working.
export function toFaq(raw: RawFaqSection): FaqData {
  return {
    eyebrow: raw.title ?? "",
    title: raw.sub_title ?? "",
    description: raw.desc ?? "",
    items: raw.items.map((item) => ({
      title: item.title,
      content: item.desc.trim().startsWith("<")
        ? sanitize(item.desc)
        : sanitize(`<p>${item.desc}</p>`),
    })),
  };
}
