export interface CategoryCardProps {
  image: string;
  title: string;
  href?: string;
  className?: string;
  imageClassName?: string;
  fillImage?: boolean;
  // Set false for a plain, non-clickable card — no hover arrow/zoom, centered title
  interactive?: boolean;
}
