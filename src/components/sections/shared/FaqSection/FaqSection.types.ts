import type { AccordionItem } from "@/components/ui/Accordion/Accordion.types";

export interface FaqSectionProps {
  eyebrow: string;
  title: string;
  description?: string;
  items: AccordionItem[];
  containerSize?: "wide" | "xl" | "large" | "standard" | "content" | "narrow" | "reading";
  className?: string;
}
