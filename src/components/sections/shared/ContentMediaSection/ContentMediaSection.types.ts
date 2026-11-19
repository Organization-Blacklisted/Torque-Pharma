import type { ContentMediaData } from "@/types/content-media";

export interface ContentMediaSectionProps extends ContentMediaData {
  // Semantic heading tag. Pages using this section as their hero must pass
  // "h1" — the visual size is h1 either way, but the tag defaults to h2.
  headingAs?: "h1" | "h2";
  /** Split-layout column ratio (text:media). Defaults to "2:3" — pass "1:1" for an even split. */
  columnRatio?: "2:3" | "1:1";
  /** Split-layout gap between the text and media columns. Defaults to "40px".
   * "112px" is a fluid clamp (24px–112px) so it stays reasonable on mobile,
   * where this same gap also separates the stacked columns vertically. */
  columnGap?: "40px" | "112px";
  className?: string;
  headerClassName?: string;
  headingClassName?: string;
  descriptionClassName?: string;
}
