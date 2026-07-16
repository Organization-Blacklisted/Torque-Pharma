// Fails the build if this module is ever imported into a Client Component,
// keeping the heavy sanitize-html library out of client bundles.
import "server-only";
import sanitizeHtml from "sanitize-html";

const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    ...sanitizeHtml.defaults.allowedTags,
    "img",
    "figure",
    "figcaption",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
  ],
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    "*": ["class"],
    img: ["src", "alt", "loading", "width", "height"],
    a: ["href", "target", "rel"],
  },
  // Force safe values on links
  allowedSchemes: ["https", "http", "mailto", "tel"],
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
  },
};

export function sanitize(html: string): string {
  return sanitizeHtml(html, OPTIONS);
}

// Sanitize + lazy-load any <img> — the rich-text pipeline for CMS HTML.
// Run this in the API/transform layer (server) so client components can render
// the result with a plain dangerouslySetInnerHTML and never bundle sanitize-html.
export function sanitizeRichText(html: string): string {
  return sanitize(html).replace(/<img(?![^>]*\bloading=)/gi, '<img loading="lazy"');
}
