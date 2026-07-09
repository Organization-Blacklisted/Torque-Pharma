import type { ProductListItem, SiblingCategory } from "@/lib/api/product-category";

export interface ProductListingSectionProps {
  products: ProductListItem[];
  siblings: SiblingCategory[];
  parentSlug: string;
  currentSlug: string;
  className?: string;
}
