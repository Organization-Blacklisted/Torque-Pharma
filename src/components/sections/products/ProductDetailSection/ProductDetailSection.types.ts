import type { ProductContentItem } from "@/lib/api/product";

export interface ProductDetailSectionProps {
  slug: string;
  name: string;
  description: string;
  featuredImage: string | null;
  gallery: string[];
  content: ProductContentItem[];
  className?: string;
}
