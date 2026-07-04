import type { ContentMediaData } from "@/types/content-media";

export interface ContentMediaSectionProps extends ContentMediaData {
  className?: string;
  headerClassName?: string;
  headingClassName?: string;
  descriptionClassName?: string;
}
