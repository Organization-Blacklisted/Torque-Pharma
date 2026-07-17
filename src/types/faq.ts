import type { AccordionItem } from "@/components/ui/Accordion/Accordion.types";

// The FAQ block shape the Laravel API returns on page endpoints.
// Field presence varies slightly per endpoint (career has no desc;
// product-category can return nulls), hence the tolerant nullability.
export interface RawFaqSection {
  title?: string | null;
  sub_title?: string | null;
  desc?: string | null;
  items: { title: string; desc: string }[];
}

// Matches FaqSection's props exactly so pages can spread: <FaqSection {...faq} />
export interface FaqData {
  eyebrow: string;
  title: string;
  description: string;
  items: AccordionItem[];
}
