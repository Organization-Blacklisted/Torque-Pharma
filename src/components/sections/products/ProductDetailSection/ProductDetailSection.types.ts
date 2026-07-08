import type { ProductContentItem } from "@/lib/api/product";

export interface ProductDetailSectionProps {
  name: string;
  description: string;
  featuredImage: string;
  gallery: string[];
  content: ProductContentItem[];
  className?: string;
}
