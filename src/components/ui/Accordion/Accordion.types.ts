export interface AccordionItem {
  id?: string;
  title: string;
  content: string;
}

export interface AccordionProps {
  items: AccordionItem[];
  defaultOpenIndex?: number;
  className?: string;
}