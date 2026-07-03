export interface TocItem {
  id: string;
  title: string;
}

export interface TableOfContentsProps {
  items: TocItem[];
  label?: string;
  className?: string;
}
