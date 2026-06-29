export interface TocItem {
  id: string;
  title: string;
}

export interface TableOfContentsProps {
  items: TocItem[];
  className?: string;
}
