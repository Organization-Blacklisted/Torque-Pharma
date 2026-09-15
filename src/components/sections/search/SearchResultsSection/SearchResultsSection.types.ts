export type SearchBy = "name" | "ingredient";

export interface SearchResultsSectionProps {
  initialQuery: string;
  initialBy: SearchBy;
  className?: string;
}
