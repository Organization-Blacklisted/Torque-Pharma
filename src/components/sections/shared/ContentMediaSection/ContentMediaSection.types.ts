import type { ContentMediaData } from "@/types/content-media";

export interface ContentMediaSectionProps extends ContentMediaData {
  // Semantic heading tag. Pages using this section as their hero must pass
  // "h1" — the visual size is h1 either way, but the tag defaults to h2.
  headingAs?: "h1" | "h2";
  className?: string;
  headerClassName?: string;
  headingClassName?: string;
  descriptionClassName?: string;
}
